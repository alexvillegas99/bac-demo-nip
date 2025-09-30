import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum NotificacionStatus {
  ABIERTA = 'abierta',
  EN_PROCESO = 'en_proceso',
  ATENDIDA = 'atendida',
  RECUPERADA = 'recuperada',
  IGNORAR = 'ignorar',
}

export enum NotificacionSeverity {
  MODERADO = 'moderado',
  ALERTA = 'alerta',
}

@Schema({ collection: 'notificaciones', timestamps: true })
export class Notificacion {
  @Prop({ required: true }) ip: string;
  @Prop({ required: true }) tipo: string;
  @Prop({ required: true }) register: string;
  @Prop({ required: true }) equipoNombre: string;

  @Prop() dataType?: string;
  @Prop({ enum: NotificacionSeverity }) severity?: NotificacionSeverity;

  @Prop({ type: mongoose.Schema.Types.Mixed }) valor?: any;
  @Prop({ type: mongoose.Schema.Types.Mixed }) umbral?: any;
  @Prop() detalle?: string;

  @Prop({ enum: NotificacionStatus, default: NotificacionStatus.ABIERTA })
  status: NotificacionStatus;

  @Prop() first_seen_at?: Date;
  @Prop() last_seen_at?: Date;
  @Prop() last_notified_at?: Date;

  @Prop() ignore_until?: Date;
  @Prop({ default: 1 }) count?: number;

  @Prop({ type: mongoose.Schema.Types.Mixed }) usuarioResponsable?: Record<string, any>;
  @Prop({ type: mongoose.Schema.Types.Mixed }) audit?: Record<string, any>;
}

export type NotificacionDocument = Notificacion & Document;
export const NotificacionSchema = SchemaFactory.createForClass(Notificacion);

NotificacionSchema.index(
  { ip: 1, tipo: 1, register: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: [NotificacionStatus.ABIERTA, NotificacionStatus.EN_PROCESO, NotificacionStatus.IGNORAR] },
    },
    name: 'uniq_active_ip_tipo_register',
  },
);
NotificacionSchema.index({ status: 1, last_notified_at: -1 });
NotificacionSchema.index({ ip: 1, tipo: 1, register: 1, status: 1 });
