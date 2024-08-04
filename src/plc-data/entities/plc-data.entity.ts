import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { format, toZonedTime } from 'date-fns-tz';

@Schema({ collection: 'plc' })
export class plcData extends Document {
  @Prop({ type: String, required: false, name: 'ST_VDF' })
  st_vdf?: string;

  @Prop({ required: false, type: String, name: 'POTENCIA' })
  potencia?: string;

  @Prop({ type: Object, required: false, name: 'CORRIENTE' })
  corriente: string;

  @Prop({ type: Object, required: false, name: 'TEMPERATURA' })
  temperatura?: string;

  @Prop({ type: Object, required: false, name: 'VOLTAJE' })
  voltaje?: string;

  @Prop({ type: Object, required: false, name: 'RPM' })
  rpm?: string;

  @Prop({ type: Date, required: false })
  createdAt: Date;
}

export const plcSchema = SchemaFactory.createForClass(plcData);


