import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RolUsuario = 'administrador' | 'visualizador' | 'operador';

@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  correo: string;

  @Prop({ required: true, unique: true })
  cedula: string;

  @Prop({ required: true })
  telefono: string;

  @Prop()
  claveTemporal: string;

  @Prop({
    type: String,
    enum: ['Administrador', 'Visualizador', 'Operador'],
    default: 'Visualizador',
  })
  rol: RolUsuario;

  @Prop({ default: true })
  estado: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type UsuarioDocument = Usuario & Document;
export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
export const UsuarioModelName = 'Usuario';
