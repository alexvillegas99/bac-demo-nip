
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ collection: 'lista-equipos' ,strict: false})
export class listaEquipos extends Document {

}

export const listaEquiposSchema = SchemaFactory.createForClass(listaEquipos);


