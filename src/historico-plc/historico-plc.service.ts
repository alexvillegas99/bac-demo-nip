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
      const { ip, limit } = body;
     
      const data = await this.plcDataBase
        .find({ IP: ip })             // Filtra por la IP proporcionada
        .sort({ _id: -1 })      // Ordena por fecha de creación en orden descendente (los más recientes primero)
        .limit(limit || 10)           // Aplica el límite, por defecto 10 si no se especifica
        .exec();
      return data;
      
    } catch (error) {
        return null;
    }
  }

}
