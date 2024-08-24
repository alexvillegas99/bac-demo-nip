import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { format, toZonedTime } from 'date-fns-tz';

@Schema({ collection: 'plc' ,strict: false})
export class plcData extends Document {

}

export const plcSchema = SchemaFactory.createForClass(plcData);


