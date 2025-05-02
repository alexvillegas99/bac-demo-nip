import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'horometros', timestamps: true }) // 👈 nombre personalizado
export class Horometro {
  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  tipo: string;

  @Prop({ required: true })
  fecha: Date;

  @Prop({ required: true })
  minutosEncendido: number;

  @Prop({ required: true })
  nombre: string;
}

export type HorometroDocument = Horometro & Document;
export const HorometroSchema = SchemaFactory.createForClass(Horometro);
export const HorometroModelName = 'Horometro';
