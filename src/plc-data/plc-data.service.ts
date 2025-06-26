import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plcData } from './entities/plc-data.entity';

type Registro = plcData & Document;
@Injectable()
export class PlcDataService {
  constructor(
    @InjectModel('plc')
    private readonly plcDataBase: Model<plcData>,
  ) {}

  async find(body: { ip: string; tipo?: string }) {
    try {
      // console.log('find', body);
      const query: any = { IP: body.ip };
      if (body.tipo) query.tipo = body.tipo;

      const data = await this.plcDataBase.find(query).exec();
      return data[0]; // solo el primero si hay varios
    } catch (error) {
      return null;
    }
  }

  async findAll() {
    try {
      const data = await this.plcDataBase.find().exec();
      return data;
    } catch (error) {
      return null;
    }
  }
}
