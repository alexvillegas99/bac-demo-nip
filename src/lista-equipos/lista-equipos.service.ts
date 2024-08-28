import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IpEquipo } from 'src/ip-equipo/entities/ip-equipo.entity';
import { listaEquipos } from './entities/lista-equipos.entity';

@Injectable()
export class ListaEquiposService {
    constructor( @InjectModel('listaEquipos') // Inyecta el modelo de MongoDB
    private readonly listaEquipos: Model<listaEquipos>,){
  
    }
    async find() {
        try {
          const data = await this.listaEquipos.find().exec();
          return data;
        } catch (error) {
            return null;
        }
        }
}
