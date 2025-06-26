import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { listaEquipos, Rango } from './entities/lista-equipos.entity';
import { ErrorHandlerService } from 'src/common/services/error-handler.service';
import { ErrorManager } from 'src/common/error.manager';

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

  async create(payload: any) {
    try {
      const respuesta = new this.listaEquipos(payload);
      return await respuesta.save();
    } catch (err) {
      throw ErrorManager.createSignatureError(err.message);
    }
  }

  async updateById(id: string, payload: any) {
    try {
      const actualizacion = await this.listaEquipos
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

  async updateRangoByDescription(
    equipoId: string,
    description: string,
    data: Partial<Rango>,
  ) {
    try {
      // Paso 1: Buscar el documento
      const equipo = await this.listaEquipos.findById(equipoId).exec();
      if (!equipo) {
        throw new Error(`No se encontró el equipo con ID ${equipoId}`);
      }

      // Paso 2: Buscar índice dentro del array `data[]`
      const dataIndex = equipo.data.findIndex(
        (item) => item.Description === description,
      );

      if (dataIndex === -1) {
        throw new Error(
          `No se encontró un registro con Description "${description}"`,
        );
      }

      // Paso 3: Construir los campos a actualizar
      const pathPrefix = `data.${dataIndex}.rango`;
      const updateFields: Record<string, any> = {};

      if (data.RangoMinimoAlerta !== undefined)
        updateFields[`${pathPrefix}.RangoMinimoAlerta`] =
          data.RangoMinimoAlerta;

      if (data.RangoMinimoModerado !== undefined)
        updateFields[`${pathPrefix}.RangoMinimoModerado`] =
          data.RangoMinimoModerado;

      if (data.RangoMaximoAlerta !== undefined)
        updateFields[`${pathPrefix}.RangoMaximoAlerta`] =
          data.RangoMaximoAlerta;

      if (data.RangoMaximoModerado !== undefined)
        updateFields[`${pathPrefix}.RangoMaximoModerado`] =
          data.RangoMaximoModerado;

      // Paso 4: Ejecutar la actualización
      const result = await this.listaEquipos.updateOne(
        { _id: equipoId },
        { $set: updateFields },
      );

      if (result.modifiedCount === 0) {
        throw new Error(
          `No se modificó el registro con Description "${description}"`,
        );
      }

      return result;
    } catch (error) {
      throw new Error(`Error actualizando rango: ${error.message}`);
    }
  }
}
