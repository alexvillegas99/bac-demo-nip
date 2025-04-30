import { Injectable } from '@nestjs/common';
import { CreateHistoricoPlcDto } from './dto/create-historico-plc.dto';
import { UpdateHistoricoPlcDto } from './dto/update-historico-plc.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HistoricoPlc } from './entities/historico-plc.entity';

@Injectable()
export class HistoricoPlcService {
  constructor(
    @InjectModel('historico-plc')
    private readonly plcDataBase: Model<HistoricoPlc>,
  ) {}
  async find(body: any) {
    try {
      const { ip, tipo, rango } = body;
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

      if (!agrupado || data.length <= 10) return data;

      // Agrupar cada campo (excepto IP y fecha) en 10 grupos promedio
      const agrupados = this.promediarPorGrupos(data, 10);
      return agrupados;
    } catch (error) {
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
    console.log('Desde:', desdeFecha, 'Hasta:', hastaFecha);
    for (const ip of ips) {
      const registros: any[] = await this.plcDataBase
        .find({
          IP: ip,
          tipo: 'pm',
          fecha: { $gte: desdeFecha, $lte: hastaFecha },
          ENERG: { $exists: true }, // ✅ Solo registros que tienen ENERG
        })
        .sort({ fecha: 1 })
        .select({ ENERG: 1, fecha: 1, _id: 0 })
        .lean(); 

      console.log('Registros:', registros);
      if (registros.length < 2) {
        resultados.push({ ip, consumo: 0, costo: 0, puntos: [] });
        continue;
      }
      const registrosFiltrados = registros.filter(
        (r) => typeof r.ENERG === 'number',
      );

      if (registrosFiltrados.length < 2) {
        resultados.push({ ip, consumo: 0, costo: 0, puntos: [] });
        continue;
      }
      console.log('Registros filtrados:', registrosFiltrados[0]);
      console.log(
        'Registros filtrados:',
        registrosFiltrados[registrosFiltrados.length - 1],
      );
      const energiaInicial = registrosFiltrados[0].ENERG;
      const energiaFinal =
        registrosFiltrados[registrosFiltrados.length - 1].ENERG;
      console.log('Primero:', energiaInicial);
      console.log('Último:', energiaFinal);

      const consumoTotal = energiaFinal - energiaInicial;
      const costoTotal = this.calcularCostoConTarifas(registrosFiltrados);
      const puntos = this.agregarCostoPorGrupo(registrosFiltrados);

      resultados.push({
        ip,
        consumo: parseFloat(consumoTotal.toFixed(2)),
        costo: parseFloat(costoTotal.toFixed(2)),
        puntos,
      });
    }

    return resultados;
  }
 
  
  
  private agregarCostoPorGrupo(data: any[]) {
    return data.map((punto, i) => {
      if (i === 0) return { ...punto, costo: 0 }; // primer punto no tiene costo
      const grupo = [data[i - 1], data[i]];
    
      return { ...punto};
    });
  }
  

  private calcularCostoConTarifas(data: any[]): number {
    let total = 0;
    for (let i = 1; i < data.length; i++) {
      const energiaConsumida = data[i].ENERG - data[i - 1].ENERG;
      const horaEcuador = new Date(data[i].fecha);
      const hora = horaEcuador.getUTCHours() - 5;
      const dia = horaEcuador.getUTCDay(); // 0 domingo ... 6 sábado
      const horaLocal = (hora + 24) % 24;

      // Tarifa por franja horaria (bombeo agua)
      const tarifa = this.obtenerTarifaPorHora(dia, horaLocal);
      total += energiaConsumida * tarifa;
    }
    return total;
  }

  private obtenerTarifaPorHora(dia: number, hora: number): number {
    // Lunes a viernes
    if (dia >= 1 && dia <= 5) {
      if (hora >= 8 && hora < 18) return 0.056;
      if (hora >= 18 && hora < 22) return 0.095;
      return 0.045; // 22h a 08h
    }

    // Sábado y domingo
    if (hora >= 18 && hora < 22) return 0.056;
    return 0.045;
  }

  
}
