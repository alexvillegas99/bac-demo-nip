import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { listaEquipos, Rango, Registro } from './entities/lista-equipos.entity';
import { ErrorHandlerService } from 'src/common/services/error-handler.service';
import { ErrorManager } from 'src/common/error.manager';
import { AmazonS3Service } from 'src/amazon-s3/amazon-s3.service';

@Injectable()
export class ListaEquiposService {
  constructor(
    @InjectModel('listaEquipos') // Inyecta el modelo de MongoDB
    private readonly listaEquipos: Model<listaEquipos>,
    private readonly _errorHandlerService: ErrorHandlerService,
    private readonly _amazonS3Service: AmazonS3Service,
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
      if (payload.imagenBase64) {
        const urlImagen = await this._amazonS3Service.uploadBase64({
          image: payload.imagenBase64,
          route: 'imagen-equipo',
        });
        payload.imagen = urlImagen.imageUrl;
        delete payload.imagenBase64;
      }
      if (payload.motorBase64) {
        const urlImagenMotor = await this._amazonS3Service.uploadBase64({
          image: payload.motorBase64,
          route: 'imagen-motor',
        });
        payload.motor = urlImagenMotor.imageUrl;
        delete payload.motorBase64;
      }
      delete payload.imagenBase64;
      delete payload.motorBase64;

      const respuesta = new this.listaEquipos(payload);
      return await respuesta.save();
    } catch (err) {
      throw ErrorManager.createSignatureError(err.message);
    }
  }

  async createValor(_id: string, payload: any) {
    try {
      return this.listaEquipos.findOneAndUpdate(
        { _id }, // o puedes usar _id u otro identificador
        { $push: { data: payload } },
        { new: true },
      );
    } catch (err) {
      throw ErrorManager.createSignatureError(err.message);
    }
  }

  async updateById(id: string, payload: any) {
    try {
      if (payload.imagenBase64) {
        const urlImagen = await this._amazonS3Service.uploadBase64({
          image: payload.imagenBase64,
          route: 'imagen-equipo',
        });
        payload.imagen = urlImagen.imageUrl;
        delete payload.imagenBase64;
      }
      if (payload.motorBase64) {
        const urlImagenMotor = await this._amazonS3Service.uploadBase64({
          image: payload.motorBase64,
          route: 'imagen-motor',
        });
        payload.motor = urlImagenMotor.imageUrl;
        delete payload.motorBase64;
      }
      delete payload.imagenBase64;
      delete payload.motorBase64;

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
    data: Partial<Registro | any>,
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
      const pathPrefixData = `data.${dataIndex}`;
      const updateFields: Record<string, any> = {};

      if (data.Description !== undefined)
        updateFields[`${pathPrefixData}.Description`] = data.newDescription;

      if (data.Register !== undefined)
        updateFields[`${pathPrefixData}.Register`] = data.Register;

      if (data.DataType !== undefined)
        updateFields[`${pathPrefixData}.DataType`] = data.DataType;

      if (data.rango?.RangoMinimoAlerta !== undefined)
        updateFields[`${pathPrefix}.RangoMinimoAlerta`] =
          data.rango?.RangoMinimoAlerta;

      if (data.rango?.RangoMinimoModerado !== undefined)
        updateFields[`${pathPrefix}.RangoMinimoModerado`] =
          data.rango?.RangoMinimoModerado;

      if (data.rango?.RangoMaximoAlerta !== undefined)
        updateFields[`${pathPrefix}.RangoMaximoAlerta`] =
          data.rango?.RangoMaximoAlerta;

      if (data.rango?.RangoMaximoModerado !== undefined)
        updateFields[`${pathPrefix}.RangoMaximoModerado`] =
          data.rango?.RangoMaximoModerado;

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
