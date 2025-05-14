import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Permisos {
  @Prop()
  descripcion: string;

  @Prop({ default: true })
  estado: boolean;
}

const PermisosSchema = SchemaFactory.createForClass(Permisos);

@Schema({ timestamps: true })
export class Perfil {
  @Prop({ required: true })
  nombre: string;

  @Prop({ default: true })
  estado: boolean;

  @Prop({ type: [PermisosSchema] })
  permisos: Permisos[];
}

export type PerfilDocument = Perfil & Document;
export const PerfilSchema = SchemaFactory.createForClass(Perfil);
export const PerfilModelName = 'Perfil';
