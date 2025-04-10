import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Orometro {
  @Prop({ required: true, unique: true })
  ip: string; // IP del equipo

  @Prop({ default: 0 })
  tiempoTotalSegundos: number;

  @Prop({ default: false })
  ultimaLecturaEstado: boolean;

  @Prop()
  proximoMantenimiento: Date; // Próxima fecha de mantenimiento

  @Prop()
  tareaProgramada: string; // Descripción del mantenimiento (ej: "Cambio de aceite")

  createdAt: Date;
  updatedAt: Date;
}

export type OrometroDocument = Orometro & Document;
export const OrometroSchema = SchemaFactory.createForClass(Orometro);
export const OrometroModelName = 'Orometro';
