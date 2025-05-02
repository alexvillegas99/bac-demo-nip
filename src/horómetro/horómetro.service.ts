import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HorometroDocument, HorometroModelName } from './schema/orometro.schema';
export class OrometroService {
  constructor(@InjectModel(HorometroModelName)
  private readonly model: Model<HorometroDocument>) {}

  

  async findPorIpsYFechas(ips: string[], fechaInicio: Date, fechaFin: Date): Promise<any> {
    const registros = await this.model.find({
      ip: { $in: ips },
      fecha: {
        $gte: fechaInicio,
        $lte: fechaFin
      }
    }).exec();
  
    // Agrupar por IP
    const agrupado = registros.reduce((acc: any, doc) => {
      if (!acc[doc.ip]) acc[doc.ip] = [];
      acc[doc.ip].push(doc);
      return acc;
    }, {});
  
    return agrupado;
  }
  
}
