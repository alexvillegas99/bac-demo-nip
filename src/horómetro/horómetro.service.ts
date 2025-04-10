import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrometroDocument, OrometroModelName } from './schema/orometro.schema';
import { Model } from 'mongoose';
export class OrometroService {
  constructor(@InjectModel(OrometroModelName) private model: Model<OrometroDocument>) {}

  async create(data: any): Promise<any> {
    return this.model.create(data);
  }

  async findAll(): Promise<any[]> {
    return this.model.find().exec();
  }
 
  async findByIp(ip: string): Promise<any> {
    return this.model.findOne({ ip }).exec();
  }

  async updateTiempo(ip: string, segundos: number): Promise<any> {
    return this.model.findOneAndUpdate(
      { ip },
      {
        $inc: { tiempoTotalSegundos: segundos },
        ultimaActualizacion: new Date(),
      },
      { new: true, upsert: true }
    );
  }
  async update(ip: string, updateData: any): Promise<any> {
    return this.model.findOneAndUpdate(
      { ip },
      { $set: updateData, updatedAt: new Date() },
      { new: true, upsert: true }
    );
  }
  
}
