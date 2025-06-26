import { Injectable } from '@nestjs/common';
import { CreateHistoricoPlcDto } from './dto/create-historico-plc.dto';
import { UpdateHistoricoPlcDto } from './dto/update-historico-plc.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HistoricoPlc } from './entities/historico-plc.entity';
import * as dayjs from 'dayjs';
@Injectable()
export class HistoricoPlcService {
 
  constructor(
    @InjectModel('historico-plc')
    private readonly plcDataBase: Model<HistoricoPlc>,
  ) {}
  /*  async find(body: any) {
    try {
      const { ip, tipo, rango } = body;
      console.log('IP:', ip);
      console.log('Tipo:', tipo);
      console.log('Rango:', rango);
      const agrupado = true; // Agrupar por defecto
      const query: any = {};
      if (ip) query.IP = ip; 
      if (tipo) query.tipo = tipo;

      const ahora = new Date();
      let fechaInicio = new Date();

      // Interpretar rango
      if (rango) {
        const unidad = rango.slice(-1);
        const cantidad = parseInt(rango);
        switch (unidad) {
          case 'h':
            fechaInicio.setHours(ahora.getHours() - cantidad);
            break;
          case 'd':
            fechaInicio.setDate(ahora.getDate() - cantidad);
            break;
          case 'm':
            fechaInicio.setMinutes(ahora.getMinutes() - cantidad);
            break;
          case 's':
            fechaInicio.setSeconds(ahora.getSeconds() - cantidad);
            break;
        }
        query.fecha = { $gte: fechaInicio };
      }

      const data = await this.plcDataBase.find(query).sort({ _id: -1 }).exec();
      return data;
      if (!agrupado || data.length <= 10) return data;

      // Agrupar cada campo (excepto IP y fecha) en 10 grupos promedio
      const agrupados = this.promediarPorGrupos(data, 10);
      return agrupados;
    } catch (error) {
      return null;
    }
  } */

  async find(body: any) {
    try {
      const { ip, tipo, desde, hasta } = body;
      //console.log('IP:', ip);
      //console.log('Tipo:', tipo);
      //console.log('Desde:', desde);
      //console.log('Hasta:', hasta);

      const matchStage: any = {
        fecha: {
          $gte: new Date(desde),
          $lte: new Date(hasta),
        },
      };
      if (ip) matchStage.IP = ip;
      if (tipo) matchStage.tipo = tipo;

      const data = await this.plcDataBase
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: {
                ip: '$IP',
                tipo: '$tipo',
                hora: {
                  $dateTrunc: {
                    date: '$fecha',
                    unit: 'hour',
                  },
                },
              },
              fecha: { $first: '$fecha' },

              // VARIADOR
              corriente: { $avg: '$corriente' },
              voltaje: { $avg: '$voltaje' },
              potencia: { $avg: '$potencia' },
              frecuencia: { $avg: '$frecuencia' },

              // PM
              CORRIENTE_TOT: { $avg: '$CORRIENTE_TOT' },
              VOLTAJE_TOT: { $avg: '$VOLTAJE_TOT' },
              POT_TOT: { $avg: '$POT_TOT' },
              FHZ_TOT: { $avg: '$FHZ_TOT' },
              FPOT_TOT: { $avg: '$FPOT_TOT' },

              CORRIENTE_A: { $avg: '$CORRIENTE_A' },
              CORRIENTE_B: { $avg: '$CORRIENTE_B' },
              CORRIENTE_C: { $avg: '$CORRIENTE_C' },
              VOLTAJE_AB: { $avg: '$VOLTAJE_AB' },
              VOLTAJE_BC: { $avg: '$VOLTAJE_BC' },
              VOLTAJE_CA: { $avg: '$VOLTAJE_CA' },

              ENERG: { $avg: '$ENERG' },

              TH_DBA: { $avg: '$TH_DBA' },
              TH_DBC: { $avg: '$TH_DBC' },
              TH_DCA: { $avg: '$TH_DCA' },
              THD_COR_A: { $avg: '$THD_COR_A' },
              THD_COR_B: { $avg: '$THD_COR_B' },
              THD_COR_C: { $avg: '$THD_COR_C' },

              POT_A: { $avg: '$POT_A' },
              POT_B: { $avg: '$POT_B' },
              POT_C: { $avg: '$POT_C' },

              FPOT_A: { $avg: '$FPOT_A' },
              FPOT_B: { $avg: '$FPOT_B' },
              FPOT_C: { $avg: '$FPOT_C' },
// Nuevos armónicos
  HARM3: { $avg: '$HARM3' },
  HARM5: { $avg: '$HARM5' },
  HARM7: { $avg: '$HARM7' },
  HARM9: { $avg: '$HARM9' },
  HARM11: { $avg: '$HARM11' },
  HARM13: { $avg: '$HARM13' },
  HARM15: { $avg: '$HARM15' },
  HARM17: { $avg: '$HARM17' },
  HARM19: { $avg: '$HARM19' },
  HARM21: { $avg: '$HARM21' },
  // Totales generales
  HARM: { $avg: '$HARM' },
  HARM_MG: { $avg: '$HARM_MG' }

            },
          },
          {
            $match: {
              $nor: [
                { corriente: 0 },
                { voltaje: 0 },
                { potencia: 0 },
                { frecuencia: 0 },
                { CORRIENTE_TOT: 0 },
                { VOLTAJE_TOT: 0 },
                { POT_TOT: 0 },
                { FHZ_TOT: 0 },
                { FPOT_TOT: 0 },
                { CORRIENTE_A: 0 },
                { CORRIENTE_B: 0 },
                { CORRIENTE_C: 0 },
                { VOLTAJE_AB: 0 },
                { VOLTAJE_BC: 0 },
                { VOLTAJE_CA: 0 },
                { TH_DBA: 0 },
                { TH_DBC: 0 },
                { TH_DCA: 0 },
                { THD_COR_A: 0 },
                { THD_COR_B: 0 },
                { THD_COR_C: 0 },
                { POT_A: 0 },
                { POT_B: 0 },
                { POT_C: 0 },
                { FPOT_A: 0 },
                { FPOT_B: 0 },
                { FPOT_C: 0 },
              ],
            },
          },

          { $sort: { _id: -1 } },
        ])
        .exec();

      return data;
    } catch (error) {
      console.error('❌ Error en find (agregado):', error);
      return null;
    }
  }

  private promediarPorGrupos(data: any[], grupos: number): any[] {
    const total = data.length;
    const tamañoGrupo = Math.ceil(total / grupos);
    const resultado: any[] = [];

    for (let i = 0; i < total; i += tamañoGrupo) {
      const grupo = data.slice(i, i + tamañoGrupo);
      if (grupo.length === 0) continue;

      const camposNum = Object.keys(grupo[0]).filter(
        (k) => typeof grupo[0][k] === 'number',
      );
      const promedios: any = {};

      camposNum.forEach((campo) => {
        const valores = grupo
          .map((item) => item[campo])
          .filter((v) => v != null);
        const suma = valores.reduce((acc, val) => acc + val, 0);
        promedios[campo] = valores.length
          ? Math.round((suma / valores.length) * 100) / 100
          : null;
      });

      promedios.fecha =
        grupo[Math.floor(grupo.length / 2)]?.fecha || new Date();
      resultado.push(promedios);
    }

    return resultado;
  }

async obtenerPromedioEnergiaPorIps(
  ips: string[],
  desde: string,
  hasta: string,
) {
  const desdeFecha = new Date(desde);
  const hastaFecha = new Date(hasta);
  const resultados = [];

  for (const ip of ips) {
    const dias = await this.plcDataBase
      .aggregate([ 
        {
          $match: {
            IP: ip,
            tipo: 'pm',
            fecha: { $gte: desdeFecha, $lte: hastaFecha },
            ENERG: { $exists: true, $type: 'number' },
          },
        },
        {
          $project: {
            ENERG: 1,
            fecha: 1,
          },
        },
        {
          $addFields: {
            dia: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$fecha',
                timezone: 'America/Guayaquil', // 🎯 importante si manejas UTC
              },
            },
          },
        },
        { $sort: { fecha: 1 } },
        {
          $group: {
            _id: '$dia',
            energiaInicial: { $first: '$ENERG' },
            energiaFinal: { $last: '$ENERG' },
            registros: { $push: { ENERG: '$ENERG', fecha: '$fecha' } },
          },
        },
        {
          $addFields: {
            consumo: {
              $round: [
                { $subtract: ['$energiaFinal', '$energiaInicial'] },
                2,
              ],
            },
          },
        },
        {
          $match: { consumo: { $gt: 0 } },
        },
        {
          $project: {
            fecha: '$_id',
            consumo: 1,
            registros: 1,
            _id: 0,
          },
        },
        { $sort: { fecha: 1 } },
      ])
      .allowDiskUse(true)
      .exec();

    for (const dia of dias) {
      try {
        dia.costo = parseFloat(
          this.calcularCostoConTarifas(dia.registros).toFixed(2),
        );
      } catch (err) {
        dia.costo = 0;
        console.warn(`⚠️ Error calculando costo para ${ip} - ${dia.fecha}`, err);
      }

      delete dia.registros;
    }

    resultados.push({ ip, dias });
  }

  return resultados;
}


  private calcularCostoConTarifas(data: any[]): number {
    let total = 0;
    for (let i = 1; i < data.length; i++) {
      const energiaConsumida = data[i].ENERG - data[i - 1].ENERG;
      const horaEcuador = new Date(data[i].fecha);
      const hora = horaEcuador.getUTCHours() - 5;
      const dia = horaEcuador.getUTCDay();
      const horaLocal = (hora + 24) % 24;

      const tarifa = this.obtenerTarifaPorHora(dia, horaLocal);
      total += energiaConsumida * tarifa;
    }
    return total;
  }

  private obtenerTarifaPorHora(dia: number, hora: number): number {
    if (dia >= 1 && dia <= 5) {
      if (hora >= 8 && hora < 18) return 0.056;
      if (hora >= 18 && hora < 22) return 0.095;
      return 0.045;
    }
    if (hora >= 18 && hora < 22) return 0.056;
    return 0.045;
  }


async obtenerConsumoCostosPorFranjas(
  ips: string[],
  desde: string,
  hasta: string,
) {
  const ip = ips[0];
  const desdeFecha = new Date(desde);
  const hastaFecha = new Date(hasta);

  const franjas = [
    { nombre: '00-06', inicio: 0, fin: 6 },
    { nombre: '06-12', inicio: 6, fin: 12 },
    { nombre: '12-18', inicio: 12, fin: 18 },
    { nombre: '18-24', inicio: 18, fin: 24 },
  ];

  const dias: string[] = [];
  const cursor = new Date(desde);
  while (cursor <= hastaFecha) {
    dias.push(cursor.toISOString().split('T')[0]);
    cursor.setDate(cursor.getDate() + 1);
  }

  const detalle: {
    fecha: string;
    franja: string;
    consumo: number;
    costo: number;
  }[] = [];

  for (const dia of dias) {
    const baseFecha = new Date(`${dia}T00:00:00-05:00`);

    for (const franja of franjas) {
      const horaInicio = new Date(baseFecha);
      horaInicio.setHours(franja.inicio);

      const horaFin = new Date(baseFecha);
      horaFin.setHours(franja.fin);

      const registroInicio: any = await this.plcDataBase
        .findOne({
          IP: ip,
          tipo: 'pm',
          fecha: { $gte: horaInicio, $lt: horaFin },
          ENERG: { $exists: true, $type: 'number' },
        })
        .sort({ fecha: 1 })
        .select({ ENERG: 1, fecha: 1 })
        .exec();

      const registroFin: any = await this.plcDataBase
        .findOne({
          IP: ip,
          tipo: 'pm',
          fecha: { $gte: horaInicio, $lt: horaFin },
          ENERG: { $exists: true, $type: 'number' },
        })
        .sort({ fecha: -1 })
        .select({ ENERG: 1, fecha: 1 })
        .exec();

      if (
        registroInicio &&
        registroFin &&
        registroFin.ENERG > registroInicio.ENERG
      ) {
        const consumo = parseFloat(
          (registroFin.ENERG - registroInicio.ENERG).toFixed(2),
        );
        const diaSemana = horaInicio.getDay();
        const horaReferencia = franja.inicio + 1;
        const tarifa = this.obtenerTarifaPorHora(diaSemana, horaReferencia);
        const costo = parseFloat((consumo * tarifa).toFixed(2));

        detalle.push({
          fecha: dia,
          franja: franja.nombre,
          consumo,
          costo,
        });
      }
    }
  }

  const resumen: Record<string, { consumo: number; costo: number }> = {
    '00-06': { consumo: 0, costo: 0 },
    '06-12': { consumo: 0, costo: 0 },
    '12-18': { consumo: 0, costo: 0 },
    '18-24': { consumo: 0, costo: 0 },
  };

  for (const item of detalle) {
    resumen[item.franja].consumo += item.consumo;
    resumen[item.franja].costo += item.costo;
  }

  const resumenTotal = Object.entries(resumen).map(([franja, valores]) => ({
    franja,
    consumo: parseFloat(valores.consumo.toFixed(2)),
    costo: parseFloat(valores.costo.toFixed(2)),
  }));

  return {
    ip,
    detalle,
    resumen: resumenTotal,
  };
}

async obtenerConsumoCostosPorFranjasAproximadas(
  ips: string[],
  desde: string,
  hasta: string,
) {
  const ip = ips[0]; // solo una IP
  const desdeFecha = new Date(desde);
  const hastaFecha = new Date(hasta);

  const franjas = [
    { nombre: '00-06', inicio: 0, fin: 6 },
    { nombre: '06-12', inicio: 6, fin: 12 },
    { nombre: '12-18', inicio: 12, fin: 18 },
    { nombre: '18-24', inicio: 18, fin: 24 },
  ];

  const dias: string[] = [];
  const cursor = new Date(desde);
  while (cursor <= hastaFecha) {
    dias.push(cursor.toISOString().split('T')[0]);
    cursor.setDate(cursor.getDate() + 1);
  }

  const detalle: {
    fecha: string;
    franja: string;
    consumo: number;
    costo: number;
  }[] = [];

  for (const dia of dias) {
    for (const franja of franjas) {
      const baseFecha = new Date(`${dia}T00:00:00-05:00`);
      const horaInicio = new Date(baseFecha);
      horaInicio.setHours(franja.inicio);
      const horaFin = new Date(baseFecha);
      horaFin.setHours(franja.fin);

      // Buscar registros más cercanos a inicio y fin
      const registroInicio:any = await this.plcDataBase
        .find({
          IP: ip,
          tipo: 'pm',
          fecha: { $gte: new Date(desde), $lte: new Date(hasta) },
          ENERG: { $exists: true, $type: 'number' },
        })
        .sort({ fecha: 1 })
        .exec();

      const inicioCercano = registroInicio.find(
        (r) => new Date(r.fecha) >= horaInicio && new Date(r.fecha) <= horaFin,
      ) || registroInicio.find(
        (r) => Math.abs(new Date(r.fecha).getTime() - horaInicio.getTime()) < 60 * 60 * 1000,
      );

      const finCercano = [...registroInicio].reverse().find(
        (r) => new Date(r.fecha) >= horaInicio && new Date(r.fecha) <= horaFin,
      ) || [...registroInicio].reverse().find(
        (r) => Math.abs(new Date(r.fecha).getTime() - horaFin.getTime()) < 60 * 60 * 1000,
      );

      if (
        inicioCercano &&
        finCercano &&
        finCercano.ENERG > inicioCercano.ENERG
      ) {
        const consumo = parseFloat(
          (finCercano.ENERG - inicioCercano.ENERG).toFixed(2),
        );
        const diaSemana = horaInicio.getDay();
        const horaReferencia = franja.inicio + 1;
        const tarifa = this.obtenerTarifaPorHora(diaSemana, horaReferencia);
        const costo = parseFloat((consumo * tarifa).toFixed(2));

        detalle.push({
          fecha: dia,
          franja: franja.nombre,
          consumo,
          costo,
        });
      }
    }
  }

  // Agrupar por franja
  const resumen: Record<string, { consumo: number; costo: number }> = {
    '00-06': { consumo: 0, costo: 0 },
    '06-12': { consumo: 0, costo: 0 },
    '12-18': { consumo: 0, costo: 0 },
    '18-24': { consumo: 0, costo: 0 },
  };

  for (const item of detalle) {
    resumen[item.franja].consumo += item.consumo;
    resumen[item.franja].costo += item.costo;
  }

  const resumenTotal = Object.entries(resumen).map(([franja, valores]) => ({
    franja,
    consumo: parseFloat(valores.consumo.toFixed(2)),
    costo: parseFloat(valores.costo.toFixed(2)),
  }));

  return {
    ip,
    detalle,
    resumen: resumenTotal,
  };
}














}
