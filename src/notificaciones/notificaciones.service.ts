import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notificacion,
  NotificacionDocument,
  NotificacionSeverity,
  NotificacionStatus,
} from './entities/notificacione.entity';
import { listaEquipos } from 'src/lista-equipos/entities/lista-equipos.entity';
import { plcData } from 'src/plc-data/entities/plc-data.entity';

const REMIND_AFTER_HOURS_ABIERTA = 5;   // reenvío si sigue abierta sin atención
const AUTO_CLOSE_ON_RECOVERY = true;
const ALLOW_NEW_AFTER_ATENDIDA = true;  // (reservado por si luego bloqueas recreación)
const IGNORE_FOR_HOURS_DEFAULT = 5;   // ⬅️ nuevo

function hoursDiff(a: Date, b: Date) {
  return (a.getTime() - b.getTime()) / 36e5;
}

type Clasificacion =
  | { state: 'ok' }
  | {
      state: 'moderado' | 'alerta';
      side?: 'min' | 'max';
      detail: string;
      severity: NotificacionSeverity;
    };

@Injectable()
export class NotificacionesService {
  private readonly logger = new Logger(NotificacionesService.name);
  private readonly verbose = process.env.NOTIF_VERBOSE === '1';

  constructor(
    @InjectModel(Notificacion.name)
    private notifModel: Model<NotificacionDocument>,
    @InjectModel(listaEquipos.name)
    private equiposModel: Model<any>,
    @InjectModel(plcData.name)
    private plcModel: Model<any>,
  ) {
    this.runMonitorNotificaciones();
  }

  // Helpers de logging
  private d(msg: string, meta?: any) {
    if (this.verbose) {
      this.logger.debug(
        meta ? `${msg} :: ${this.safeJson(meta)}` : msg,
      );
    }
  }
  private safeJson(obj: any, max = 800) {
    try {
      const s = JSON.stringify(obj);
      if (s.length > max) return s.slice(0, max) + '…';
      return s;
    } catch {
      return String(obj);
    }
  }

  // === Núcleo: clasifica según rango / tipo de dato ===
 private clasificar(valor: any, dataType: string, rango?: any): Clasificacion {
  if (valor === null || valor === undefined) return { state: 'ok' as const };

  if ((dataType || '').toLowerCase() === 'boolean') {
    // 1 => ALERTA, 0 => OK (ajústalo si quieres)
    if (valor) {
      return {
        state: 'alerta',
        detail: 'Booleano = 1',
        severity: NotificacionSeverity.ALERTA,
      } as const; // ⬅️ fuerza literales
    }
    return { state: 'ok' as const };
  }

  const v = Number(valor);
  if (isNaN(v) || !rango) return { state: 'ok' as const };

  const {
    RangoMinimoModerado = 0,
    RangoMinimoAlerta = 0,
    RangoMaximoModerado = 0,
    RangoMaximoAlerta = 0,
  } = rango;

  if (RangoMinimoAlerta && v < RangoMinimoAlerta) {
    return {
      state: 'alerta',
      side: 'min',
      detail: `Valor ${v} < MinAlerta ${RangoMinimoAlerta}`,
      severity: NotificacionSeverity.ALERTA,
    } as const;
  }
  if (RangoMinimoModerado && v < RangoMinimoModerado) {
    return {
      state: 'moderado',
      side: 'min',
      detail: `Valor ${v} < MinModerado ${RangoMinimoModerado}`,
      severity: NotificacionSeverity.MODERADO,
    } as const;
  }

  if (RangoMaximoAlerta && v > RangoMaximoAlerta) {
    return {
      state: 'alerta',
      side: 'max',
      detail: `Valor ${v} > MaxAlerta ${RangoMaximoAlerta}`,
      severity: NotificacionSeverity.ALERTA,
    } as const;
  }
  if (RangoMaximoModerado && v > RangoMaximoModerado) {
    return {
      state: 'moderado',
      side: 'max',
      detail: `Valor ${v} > MaxModerado ${RangoMaximoModerado}`,
      severity: NotificacionSeverity.MODERADO,
    } as const;
  }

  return { state: 'ok' as const };
}

  // === Última lectura por IP+tipo (rápido para muchos equipos) ===
  private async ultimasLecturasPorIPTipo(): Promise<Map<string, any>> {
    this.d('ultimasLecturasPorIPTipo: iniciando aggregate');
    const t0 = Date.now();
    const cursor = await this.plcModel.aggregate([
      { $sort: { fecha: -1 } },
      { $group: { _id: { IP: '$IP', tipo: '$tipo' }, doc: { $first: '$$ROOT' } } },
    ]);
    const map = new Map<string, any>();
    for (const row of cursor) {
      const key = `${(row._id.IP || '').toString()}|${(row._id.tipo || '').toString()}`.toLowerCase();
      map.set(key, row.doc);
    }
    const ms = Date.now() - t0;
    this.logger.log(`ultimasLecturasPorIPTipo: ${cursor.length} lecturas en ${ms}ms`);
    return map;
  }

  // === Enviar notificación (stub para WhatsApp/Bitrix/Email/WebSocket) ===
  private async enviarAviso(n: Notificacion) {
    // Conecta aquí a tu emisor real. Por ahora log:
    this.logger.warn(
      `[ALERTA] ${n.equipoNombre} (${n.ip}/${n.tipo}) ${n.register} => ${n.valor} [${n.severity}]`,
    );
    this.d('enviarAviso: payload', n);
  }

  // === Lógica de apertura/recordatorio/cierre ===
  private async procesarAlarma(params: {
    ip: string;
    tipo: string;
    equipoNombre: string;
    register: string;
    dataType?: string;
    valor: any;
    umbral?: any;
    detalle: string;
    severity: NotificacionSeverity;
  }) {
    const now = new Date();
    this.d('procesarAlarma: start', params);

    const activa = await this.notifModel.findOne({
      ip: params.ip,
      tipo: params.tipo,
      register: params.register,
      status: { $in: [NotificacionStatus.ABIERTA, NotificacionStatus.EN_PROCESO, NotificacionStatus.IGNORAR] },
    });

    if (activa) {
      this.d('procesarAlarma: notificación activa encontrada', {
        id: activa._id?.toString(),
        status: activa.status,
        last_notified_at: activa.last_notified_at,
      });

      activa.last_seen_at = now;
      activa.valor = params.valor;
      activa.severity = params.severity;
      activa.umbral = params.umbral;
      activa.detalle = params.detalle;

      if (activa.status === NotificacionStatus.EN_PROCESO) {
        this.logger.log(
          `EN_PROCESO: no re-notificar (${params.ip}/${params.tipo}/${params.register})`,
        );
        await activa.save();
        return;
      }

       if (activa.status === NotificacionStatus.IGNORAR) {
    // ⬅️ clave: silencio mientras no expire
    if (activa.ignore_until && now < activa.ignore_until) {
      this.logger.log(
        `IGNORAR hasta ${activa.ignore_until.toISOString()} — suprimido (${params.ip}/${params.tipo}/${params.register})`,
      );
      await activa.save();
      return;
    }
    // Expiró el “ignorar”: volvemos a ciclo normal como ABierta y avisamos
    this.logger.log(`IGNORAR expiró — reactivando como ABIERTA y notificando`);
    activa.status = NotificacionStatus.ABIERTA;
    activa.last_notified_at = now;
    activa.count = (activa.count || 1) + 1;
    await activa.save();
    await this.enviarAviso(activa);
    return;
  }

      // ABierta: ver si toca recordatorio
      if (!activa.last_notified_at || hoursDiff(now, activa.last_notified_at) >= REMIND_AFTER_HOURS_ABIERTA) {
        activa.last_notified_at = now;
        activa.count = (activa.count || 1) + 1;
        await activa.save();
        this.logger.log(
          `RECORDATORIO (${params.severity}): ${params.equipoNombre} ${params.register} => ${params.valor}`,
        );
        await this.enviarAviso(activa);
      } else {
        this.d('procesarAlarma: dentro de ventana, no re-notificar', {
          horas_desde_ultimo: activa.last_notified_at ? hoursDiff(now, activa.last_notified_at) : null,
        });
        await activa.save();
      }
      return;
    }

    // No hay activa => crear ABierta
    this.logger.log(
      `NUEVA ABIERTA (${params.severity}): ${params.equipoNombre} (${params.ip}/${params.tipo}) ${params.register} => ${params.valor}`,
    );
    const creada = await this.notifModel.create({
      ip: params.ip,
      tipo: params.tipo,
      register: params.register,
      equipoNombre: params.equipoNombre,
      dataType: params.dataType,
      severity: params.severity,
      valor: params.valor,
      umbral: params.umbral,
      detalle: params.detalle,
      status: NotificacionStatus.ABIERTA,
      first_seen_at: now,
      last_seen_at: now,
      last_notified_at: now,
      count: 1,
    });

    await this.enviarAviso(creada);
  }

  private async cerrarPorRecuperacion(ip: string, tipo: string, register: string, valorOk: any) {
    if (!AUTO_CLOSE_ON_RECOVERY) return;

    const ahora = new Date();
    const activa = await this.notifModel.findOne({
      ip, tipo, register,
      status: { $in: [NotificacionStatus.ABIERTA, NotificacionStatus.EN_PROCESO, NotificacionStatus.IGNORAR] },
    });

    if (!activa) {
      this.d('cerrarPorRecuperacion: no había activa', { ip, tipo, register });
      return;
    }

    activa.status = NotificacionStatus.RECUPERADA;
    activa.audit = { ...(activa.audit || {}), recovered_at: ahora };
    activa.last_seen_at = ahora;
    activa.valor = valorOk;
    await activa.save();

    this.logger.log(
      `RECUPERADA: (${ip}/${tipo}/${register}) valor=${valorOk}`,
    );
  }

  // === CRON: corre cada minuto ===
  @Cron(CronExpression.EVERY_MINUTE)
  async runMonitorNotificaciones() {
    const t0 = Date.now();
    this.logger.log('CRON notificaciones: inicio -> validación de máximos y mínimos');

    try {
      const [equipos, ultimas] = await Promise.all([
        this.equiposModel.find({}).lean(),
        this.ultimasLecturasPorIPTipo(),
      ]);
      console.log(equipos);
      console.log(ultimas);

      this.logger.log(`CRON: equipos=${equipos.length}, lecturas=${ultimas.size}`);

      for (const eq of equipos) {
        try {
          const key = `${(eq.ip || '').toString()}|${(eq.tipo || '').toString()}`.toLowerCase();
          const last = ultimas.get(key);

          if (!last) {
            this.d('CRON: sin lectura reciente, skip equipo', { ip: eq.ip, tipo: eq.tipo });
            continue;
          }

          const equipoNombre = eq.nombre || last.nombre || `${eq.ip} ${eq.tipo}`;
          this.d('CRON: procesando equipo', { ip: eq.ip, tipo: eq.tipo, equipoNombre });

for (const reg of eq.data || []) {
  try {
    // 1) Determinar la llave real en doc PLC
    const descKey = reg?.Description; // p.ej. "CORRIENTE_A" o "corriente"
    const regKey  = reg?.Register;    // p.ej. "335" (modbus, casi nunca está en el doc PLC)

    let plcKey: string | null = null;
    if (descKey && Object.prototype.hasOwnProperty.call(last, descKey)) {
      plcKey = descKey;
    } else if (regKey && Object.prototype.hasOwnProperty.call(last, regKey)) {
      plcKey = regKey;
    }

    if (!plcKey) {
      this.d('CRON: no se encontró llave PLC para el registro', {
        descKey, regKey, disponibles: Object.keys(last).slice(0, 20)
      });
      continue;
    }

    const valor = last[plcKey];
    if (valor === undefined || valor === null) {
      this.d('CRON: valor undefined/null en doc PLC', { plcKey });
      continue;
    }

    // 2) Sólo evaluamos si EXISTE rango (tu regla)
    const dataType = (reg?.DataType || '').toLowerCase();
    const rango = reg?.rango || undefined;

    if (!rango) {
      // No tocar notificaciones (ni abrir ni cerrar) si no hay umbrales
      this.logger.log(`SKIP sin rango -> ${eq.ip}/${eq.tipo} ${plcKey} (valor=${valor})`);
      continue;
    }

    this.d('CRON: lectura con rango', { plcKey, valor, dataType, rango });

    const cls = this.clasificar(valor, dataType, rango);

    if (cls.state === 'ok') {
      // OK con rango definido => sí podemos cerrar por recuperación si hubiese activa
      this.d('CRON: estado OK, intento cerrar recuperacion si aplica', { plcKey, valor });
      await this.cerrarPorRecuperacion(eq.ip, eq.tipo, plcKey, valor);
    } else {
      this.d('CRON: estado NO-OK, procesar alarma', { plcKey, cls });
      await this.procesarAlarma({
        ip: eq.ip,
        tipo: eq.tipo,
        equipoNombre,
        register: plcKey,   // guardamos la llave real usada
        dataType,
        valor,
        umbral: rango,
        detalle: cls.detail,
        severity: cls.severity,
      });
    }
  } catch (e: any) {
    this.logger.error(
      `Error procesando registro ${reg?.Description || reg?.Register} de equipo ${eq.ip}/${eq.tipo}: ${e?.message}`,
      e?.stack,
    );
  }
}

// ...

        } catch (e: any) {
          this.logger.error(
            `Error procesando equipo ${eq?.ip}/${eq?.tipo}: ${e?.message}`,
            e?.stack,
          );
        }
      }
    } catch (err: any) {
      this.logger.error(`CRON notificaciones: fallo general -> ${err?.message}`, err?.stack);
    } finally {
      const ms = Date.now() - t0;
      this.logger.log(`CRON notificaciones: fin en ${ms}ms`);
    }
  }

  // === API ===
  async listar(query: {
    status?: NotificacionStatus | NotificacionStatus[];
    ip?: string;
    tipo?: string;
    register?: string;
    desde?: string;
    hasta?: string;
    limit?: number;
  }) {
    const q: any = {};
    if (query.status) q.status = Array.isArray(query.status) ? { $in: query.status } : query.status;
    if (query.ip) q.ip = query.ip;
    if (query.tipo) q.tipo = query.tipo;
    if (query.register) q.register = query.register;

    if (query.desde || query.hasta) {
      q.createdAt = {};
      if (query.desde) q.createdAt.$gte = new Date(query.desde);
      if (query.hasta) q.createdAt.$lte = new Date(query.hasta);
    }

    const limit = Number(query.limit) || 100;
    this.d('API listar: query', { q, limit });
    const res = await this.notifModel.find(q).sort({ createdAt: -1 }).limit(limit).lean();
    this.d('API listar: results', { count: res.length });
    return res;
  }

async cambiarEstado(id: string, status: NotificacionStatus, usuarioResponsable?: any, ignoreForHours?: number) {
  const ahora = new Date();
  const n = await this.notifModel.findById(id);
  if (!n) return null;

  n.status = status;

  if (status === NotificacionStatus.EN_PROCESO) {
    // reconocer ⇒ en_proceso + asignar responsable
    if (usuarioResponsable) n.usuarioResponsable = usuarioResponsable;
    n.audit = { ...(n.audit || {}), assigned_to: usuarioResponsable || n.usuarioResponsable, assigned_at: ahora };
  }

  if (status === NotificacionStatus.ATENDIDA) {
    // cerrar ⇒ atendida (puedes enviar responsable aquí también)
    if (usuarioResponsable) n.usuarioResponsable = usuarioResponsable;
    n.audit = { ...(n.audit || {}), attended_by: usuarioResponsable || n.usuarioResponsable, attended_at: ahora };
  }

  if (status === NotificacionStatus.IGNORAR) {
    // aplazar ⇒ ignorar + ventana
    if (usuarioResponsable) n.usuarioResponsable = usuarioResponsable;
    const hours = (typeof ignoreForHours === 'number' && ignoreForHours > 0) ? ignoreForHours : IGNORE_FOR_HOURS_DEFAULT;
    n.ignore_until = new Date(ahora.getTime() + hours * 36e5);
    n.audit = { ...(n.audit || {}), ignored_by: usuarioResponsable || n.usuarioResponsable, ignored_at: ahora, ignore_hours: hours };
  }

  await n.save();
  return n.toObject();
}
  // Mapa de defaults por variable (AJÚSTALO a tu plan
}
