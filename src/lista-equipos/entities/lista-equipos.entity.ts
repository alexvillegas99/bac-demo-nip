import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Registro {
  @Prop()
  Description: string;

  @Prop()
  Register: string;

  @Prop()
  DataType: string;
}

const RegistroSchema = SchemaFactory.createForClass(Registro);

@Schema({ collection: 'lista-equipos', strict: false })
export class listaEquipos extends Document {
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

export const listaEquiposSchema = SchemaFactory.createForClass(listaEquipos);
