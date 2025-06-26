import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Rango {
  @Prop({ default: 0 })
  RangoMinimoModerado: number;

  @Prop({ default: 0 })
  RangoMinimoAlerta: number;

  @Prop({ default: 0 })
  RangoMaximoModerado: number;

  @Prop({ default: 0 })
  RangoMaximoAlerta: number;
}
const RangoSchema = SchemaFactory.createForClass(Rango);

@Schema({ _id: false })
export class Registro {
  @Prop()
  Description: string;

  @Prop()
  Register: string;

  @Prop()
  DataType: string;

  @Prop({ type: RangoSchema })
  rango: Rango;
}
const RegistroSchema = SchemaFactory.createForClass(Registro);

@Schema({ collection: 'lista-equipos', strict: false })
export class listaEquipos {
  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  modelo: string;

  @Prop({ required: true })
  serie: string;

  @Prop({ required: true })
  area: string;

  @Prop({ required: true })
  imagen: string;

  @Prop({ required: true })
  tipo: string;

  @Prop()
  ubicacion: string;

  @Prop()
  Inom: string;

  @Prop()
  Nnom: string;

  @Prop()
  Pnom: string;

  @Prop()
  Vnom: string;

  @Prop()
  motor: string;

  @Prop({ type: [RegistroSchema] })
  data: Registro[];
}
export type listaEquiposDocument = listaEquipos & Document;
export const listaEquiposSchema = SchemaFactory.createForClass(listaEquipos);
export const listaEquiposModelName = 'listaEquipos';
