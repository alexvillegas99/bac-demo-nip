import { Module } from '@nestjs/common';
import { TareasController } from './tareas.controller';
import { TareaService } from './tareas.service';
import { ErrorHandlerService } from 'src/common/services/error-handler.service';
import { TareaSchema } from './schema/tarea.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'tarea', schema: TareaSchema }]),
  ],
  controllers: [TareasController],
  providers: [TareaService, ErrorHandlerService],
})
export class TareasModule {}
