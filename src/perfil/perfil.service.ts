import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorManager } from 'src/common/error.manager';
import { ErrorHandlerService } from 'src/common/services/error-handler.service';
import { Perfil } from './schema/perfil.schema';

@Injectable()
export class PerfilService {
  constructor(
    @InjectModel('perfil')
    private readonly perfil: Model<Perfil>,
    private readonly _errorHandlerService: ErrorHandlerService,
  ) {}

  async find() {
    try {
      const data = await this.perfil.find().exec();
      return data;
    } catch (error) {
      this._errorHandlerService.handleCustomError(error.response);
    }
  }

  async findByName(name: string) {
    try {
      const data = await this.perfil
        .find({
          nombre: name,
        })
        .exec();
      return data;
    } catch (error) {
      this._errorHandlerService.handleCustomError(error.response);
    }
  }

  async create(payload: any) {
    try {
      const respuesta = new this.perfil(payload);
      return await respuesta.save();
    } catch (err) {
      console.error(err, 'error');
      throw ErrorManager.createSignatureError(err.message);
    }
  }

  async updateById(id: string, payload: any) {
    try {
      const actualizacion = await this.perfil
        .findByIdAndUpdate(id, payload, {
          new: true,
        })
        .exec();
      if (!actualizacion) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: `No se actualizó el registro con id ${id}`,
        });
      }
      return actualizacion;
    } catch (err) {
      throw ErrorManager.createSignatureError(err.message);
    }
  }
}
