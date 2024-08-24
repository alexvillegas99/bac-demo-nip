

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { format, toZonedTime } from 'date-fns-tz';

@Schema({ collection: 'historico-plc' ,strict: false})
export class HistoricoPlc extends Document {

}

export const HistoricoPlcSchema = SchemaFactory.createForClass(HistoricoPlc);


