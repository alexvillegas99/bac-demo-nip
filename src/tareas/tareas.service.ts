import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorHandlerService } from 'src/common/services/error-handler.service';
import { Model } from 'mongoose';
import { ErrorManager } from 'src/common/error.manager';
import { Actividad, Tarea } from './schema/tarea.schema';

@Injectable()
export class TareaService {
  constructor(
    @InjectModel('tarea')
    private readonly tarea: Model<Tarea>,
    private readonly _errorHandlerService: ErrorHandlerService,
  ) {}

  async find() {
    try {
      const data = await this.tarea.find().exec();
      return data;
    } catch (error) {
      this._errorHandlerService.handleCustomError(error.response);
    }
  }

  async create(payload: any) {
    try {
      const respuesta = new this.tarea(payload);
      return await respuesta.save();
    } catch (err) {
      console.error(err, 'error');
      throw ErrorManager.createSignatureError(err.message);
    }
  }

  async updateById(id: string, payload: any) {
    try {
      const actualizacion = await this.tarea
        .findByIdAndUpdate(id, payload, { new: true })
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

  async updateSubtaskById(
    tareaId: string,
    actividadId: string,
    data: Partial<Actividad>,
  ) {
    try {
      const result = await this.tarea.updateOne(
        { _id: tareaId, 'actividades._id': actividadId },
        {
          $set: {
            'actividades.$.descripcion': data.descripcion,
            'actividades.$.duracionEstimada': data.duracionEstimada,
            'actividades.$.tipoTarea': data.tipoTarea,
            'actividades.$.estado': data.estado,
          },
        },
      );

      if (result.modifiedCount === 0) {
        throw new Error('No se encontró o no se modificó la actividad');
      }

      console.log(result, 'result');

      return result;
    } catch (error) {
      throw new Error(`Error actualizando actividad: ${error.message}`);
    }
  }

  async deleteById(id: string): Promise<{ deleted: boolean; id: string }> {
    try {
      const resultado = await this.tarea.findByIdAndDelete(id).exec();
      if (!resultado) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: `No se encontró el registro con id ${id}`,
        });
      }
      return {
        deleted: true,
        id: id,
      };
    } catch (err) {
      throw ErrorManager.createSignatureError(err.message);
    }
  }

  async findSubtask(id: string) {
    try {
      const data = await this.tarea.findById(id).exec();
      return data;
    } catch (error) {
      this._errorHandlerService.handleCustomError(error.response);
    }
  }
}
