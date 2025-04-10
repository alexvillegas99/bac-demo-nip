import { forwardRef, Module } from '@nestjs/common';
import { PlcDataService } from './plc-data.service';
import { PlcDataController } from './plc-data.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { plcSchema } from './entities/plc-data.entity';
import { SocketsGateway } from 'src/sockets/sockets.gateway';
import { SocketsModule } from 'src/sockets/sockets.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'plc', schema: plcSchema }]), 
  ],
  controllers: [PlcDataController],
  providers: [PlcDataService], // Inyecta el Gateway en el servicio
  exports: [PlcDataService],
})
export class PlcDataModule {}
