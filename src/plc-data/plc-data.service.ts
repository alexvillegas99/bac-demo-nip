import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plcData } from './entities/plc-data.entity';
import { addDays, format } from 'date-fns';
import { toDate } from 'date-fns-tz';

type Registro = plcData & Document;
@Injectable()
export class PlcDataService {
  constructor(
    @InjectModel('plc')
    private readonly plcDataBase: Model<plcData>,
  ) {}

  async find(body: any) {
    try {
      const data = await this.plcDataBase
        .find({   IP: body.ip  })
        .exec();
        return data[0];
    } catch (error) {
      return null;
    }
  }
}
