
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { format, toZonedTime } from 'date-fns-tz';

@Schema({ collection: 'ipEquipo' ,strict: false})
export class IpEquipo extends Document {

}

export const ipEquipoSchema = SchemaFactory.createForClass(IpEquipo);


