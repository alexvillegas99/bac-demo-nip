import { Module } from '@nestjs/common';
import { HistoricoPlcService } from './historico-plc.service';
import { HistoricoPlcController } from './historico-plc.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoricoPlcSchema } from './entities/historico-plc.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'historico-plc', schema: HistoricoPlcSchema }]), // Configura el modelo y el esquema de MongoDB
  ],
  controllers: [HistoricoPlcController],
  providers: [HistoricoPlcService],
  exports:[HistoricoPlcService]
})
export class HistoricoPlcModule {}
