import { Injectable } from '@nestjs/common';
import { CreateIpEquipoDto } from './dto/create-ip-equipo.dto';
import { UpdateIpEquipoDto } from './dto/update-ip-equipo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IpEquipo } from './entities/ip-equipo.entity';

@Injectable()
export class IpEquipoService {

  constructor( @InjectModel('ipEquipo') // Inyecta el modelo de MongoDB
  private readonly plcDataBase: Model<IpEquipo>,){

  }


  async find() {
  try {
    const data = await this.plcDataBase.find().exec();
    return data[0];
  } catch (error) {
      return null;
  }
  }

}
