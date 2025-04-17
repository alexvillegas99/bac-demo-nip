import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { listaEquipos } from './entities/lista-equipos.entity';
import { ErrorHandlerService } from 'src/common/services/error-handler.service';

@Injectable()
export class ListaEquiposService {
  constructor(
    @InjectModel('listaEquipos') // Inyecta el modelo de MongoDB
    private readonly listaEquipos: Model<listaEquipos>,
    private readonly _errorHandlerService: ErrorHandlerService,
  ) {}
  async find() {
    try {
      const data = await this.listaEquipos.find().exec();
      return data;
    } catch (error) {
      this._errorHandlerService.handleCustomError(error.response);
    }
  }
}
