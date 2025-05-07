import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HorometroDocument,
  HorometroModelName,
} from './schema/orometro.schema';
import {
  HistorialHorometroDocument,
  HistorialHorometroModelName,
} from './schema/historial-horometro.schme';
export class OrometroService {
  constructor(
    @InjectModel(HorometroModelName)
    private readonly model: Model<HorometroDocument>,
    @InjectModel(HistorialHorometroModelName)
    private readonly modelHistorial: Model<HistorialHorometroDocument>,
  ) {}

  async findPorIpsYFechas(ips: string[]): Promise<any> {
    console.log('ips', ips);
    const registros = await this.model
      .find({
        ip: { $in: ips },
      })
      .lean()
      .exec();

      console.log('registros', registros);
    
      //agrupar por ip todo el historial

    // Agrupar por IP
    const agrupado = registros.reduce((acc: any, doc) => {
      if (!acc[doc.ip]) acc[doc.ip] = [];
      acc[doc.ip].push(doc);
      return acc;
    }, {});
    console.log('agrupado', agrupado);    
    return agrupado;
  }

  async findHisorialPorIp(ips: string[]): Promise<any> {
    const registros = await this.modelHistorial
      .find({
        ip: { $in: ips },
      })
      .exec();

    const agrupado = registros.reduce((acc: any, doc) => {
      if (!acc[doc.ip]) acc[doc.ip] = [];
      acc[doc.ip].push(doc);
      return acc;
    }, {});

    return agrupado;
  }

  async crearRegistroHistorico(ip: any): Promise<any> {
    const registros = await this.model.find({ ip: ip }).exec();

    const totalMinutos = registros.reduce(  
        
        (acc: number, doc) => acc + doc.minutosEncendido,
        0,
      );
    console.log('Total minutos:', totalMinutos);
     const nuevoRegistro = new this.modelHistorial({
      ip: ip,
      tipo:'variador',
      fecha: new Date(),
      minutosEncendido: totalMinutos
     });
    const dataNew = nuevoRegistro.save();
   
     //clonar el ultimoo registro de horometro

    const ultimoRegistro = await this.model.findOne({ ip: ip }).sort({ fecha: -1 }).exec();

 //eliminar docuemntos de horometro con la misma ip
    await this.model.deleteMany({ ip: ip });

    // Crear un nuevo documento con los mismos datos pero con tiempo 0
    const nuevoRegistroHorometro = new this.model({
      ip: ultimoRegistro.ip,
      tipo: ultimoRegistro.tipo,
      fecha: new Date(),
      minutosEncendido: 0,
      nombre: ultimoRegistro.nombre,
    });

    // Guardar el nuevo documento en la colección de horometros
    await nuevoRegistroHorometro.save();

    return dataNew;
  }
}
