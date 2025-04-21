import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Actividad {
  @Prop()
  descripcion: string;

  @Prop()
  duracionEstimada: string;

  @Prop()
  tipoTarea: string;

  @Prop()
  estado: boolean;
}

const ActividadesSchema = SchemaFactory.createForClass(Actividad);

@Schema({ timestamps: true })
export class Tarea {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  usuarioAsignado: string;

  @Prop({ required: true })
  prioridad: string;

  @Prop({ type: [ActividadesSchema] })
  actividades: Actividad[];
}

export type TareaDocument = Tarea & Document;
export const TareaSchema = SchemaFactory.createForClass(Tarea);
export const TareaModelName = 'Tarea';
