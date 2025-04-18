import { Injectable } from '@nestjs/common';
import { CreateHistoricoPlcDto } from './dto/create-historico-plc.dto';
import { UpdateHistoricoPlcDto } from './dto/update-historico-plc.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HistoricoPlc } from './entities/historico-plc.entity';

@Injectable()
export class HistoricoPlcService {
  constructor( @InjectModel('historico-plc')
  private readonly plcDataBase: Model<HistoricoPlc>,){
   
  }
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
          case 'h': fechaInicio.setHours(ahora.getHours() - cantidad); break;
          case 'd': fechaInicio.setDate(ahora.getDate() - cantidad); break;
          case 'm': fechaInicio.setMinutes(ahora.getMinutes() - cantidad); break;
          case 's': fechaInicio.setSeconds(ahora.getSeconds() - cantidad); break;
        }
        query.fecha = { $gte: fechaInicio };
      }
  
      const data = await this.plcDataBase
        .find(query)
        .sort({ _id: -1 })
        .exec();
  
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
  
      const camposNum = Object.keys(grupo[0]).filter(k => typeof grupo[0][k] === 'number');
      const promedios: any = {};
  
      camposNum.forEach(campo => {
        const valores = grupo.map((item) => item[campo]).filter(v => v != null);
        const suma = valores.reduce((acc, val) => acc + val, 0);
        promedios[campo] = valores.length ? Math.round((suma / valores.length) * 100) / 100 : null;
      });
  
      promedios.fecha = grupo[Math.floor(grupo.length / 2)]?.fecha || new Date();
      resultado.push(promedios);
    }
  
    return resultado;
  }
  
  
  

}
