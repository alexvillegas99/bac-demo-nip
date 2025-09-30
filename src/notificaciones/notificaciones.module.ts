import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { Notificacion, NotificacionSchema } from './entities/notificacione.entity';
import { listaEquipos, listaEquiposSchema } from 'src/lista-equipos/entities/lista-equipos.entity';
import { plcData, plcSchema } from 'src/plc-data/entities/plc-data.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Notificacion.name, schema: NotificacionSchema },
      { name: listaEquipos.name, schema: listaEquiposSchema },
      { name: plcData.name, schema: plcSchema },
    ]),
  ],
  controllers: [NotificacionesController],
  providers: [NotificacionesService],
  exports: [NotificacionesService],
})
export class NotificacionesModule {}
