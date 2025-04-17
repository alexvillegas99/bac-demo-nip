import { Module } from '@nestjs/common';
import { ListaEquiposService } from './lista-equipos.service';
import { ListaEquiposController } from './lista-equipos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { listaEquiposSchema } from './entities/lista-equipos.entity';
import { ErrorHandlerService } from 'src/common/services/error-handler.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'listaEquipos', schema: listaEquiposSchema },
    ]), // Configura el modelo y el esquema de MongoDB
  ],
  controllers: [ListaEquiposController],
  providers: [ListaEquiposService, ErrorHandlerService],
})
export class ListaEquiposModule {}
