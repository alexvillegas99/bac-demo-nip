import { Module } from '@nestjs/common';
import { PlcDataService } from './plc-data.service';
import { PlcDataController } from './plc-data.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { plcSchema } from './entities/plc-data.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'plc', schema: plcSchema }]), // Configura el modelo y el esquema de MongoDB
  ],
  controllers: [PlcDataController],
  providers: [PlcDataService],
  exports: [PlcDataService],
})
export class PlcDataModule {}
