import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'historial-horometros', timestamps: true }) // 👈 nombre personalizado
export class Historial_horometro {
  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  tipo: string;

  @Prop({ required: true })
  fecha: Date;

  @Prop({ required: true })
  minutosEncendido: number;

  
}

export type HistorialHorometroDocument = Historial_horometro & Document;
export const HistorialHorometroSchema = SchemaFactory.createForClass(Historial_horometro);
export const HistorialHorometroModelName = 'historial-horometros';
