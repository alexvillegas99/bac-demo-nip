import { Module } from '@nestjs/common';
import { IpEquipoService } from './ip-equipo.service';
import { IpEquipoController } from './ip-equipo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ipEquipoSchema } from './entities/ip-equipo.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ipEquipo', schema: ipEquipoSchema }]), // Configura el modelo y el esquema de MongoDB
  ],
  controllers: [IpEquipoController],
  providers: [IpEquipoService],
})
export class IpEquipoModule {}
