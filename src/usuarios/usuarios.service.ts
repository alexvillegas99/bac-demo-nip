import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { v4 as uuid } from 'uuid';
import { Usuario } from './entities/usuario.entity';
import { UsuarioDocument } from './schema/usuario.schema';

@Injectable()
export class UsuariosService {
  async findByEmail(correo: string) {
    return await this.usuarioModel.findOne({ correo }).exec();
  }
  constructor(
    @InjectModel(Usuario.name)
    private usuarioModel: Model<UsuarioDocument>,
  ) {}

  async crearUsuario(data: any) {
    const claveTemporal = uuid().slice(0, 6);
    const usuario = new this.usuarioModel({
      ...data,
      rol: data.rol ?? '  Visualizador', // usa rol si viene, si no, 'visualizador'
      claveTemporal,
    });
  
    await usuario.save();
  
    // TODO: Enviar clave por correo
    return {
      mensaje: 'Usuario creado con clave temporal.',
      correo: usuario.correo,
      rol: usuario.rol,
      claveTemporal, // solo para pruebas
    };
  }
  async editarUsuario(id: string, data: any) {
    const usuario = await this.usuarioModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
  
    return {
      mensaje: 'Usuario actualizado',
      usuario,
    };
  }
  
  async cambiarEstadoUsuario(id: string, estado: boolean) {
    const usuario = await this.usuarioModel.findById(id);
  
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
  
    usuario.estado = estado;
    await usuario.save();
  
    return {
      mensaje: `Usuario ${estado ? 'habilitado' : 'deshabilitado'}`,
      usuario,
    };
  }
  async listarUsuarios(rol?: string, estado?: string) {
    const filtro: any = {};
  
    if (rol) {
      filtro.rol = rol;
    }
  
    if (estado !== undefined) {
      filtro.estado = estado === 'true'; // convierte string a boolean
    }
  
    const usuarios = await this.usuarioModel.find(filtro);
    return {
      mensaje: 'Lista de usuarios',
      total: usuarios.length,
      data: usuarios,
    };
  }
  
  async obtenerUsuarioPorId(id: string) {
    const usuario = await this.usuarioModel.findById(id);
  
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
  
    return {
      mensaje: 'Usuario encontrado',
      usuario,
    };
  }
  

}
