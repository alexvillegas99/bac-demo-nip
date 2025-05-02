import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Horometro, HorometroSchema } from './schema/orometro.schema';
import { OrometroController } from './horómetro.controller';
import { OrometroService } from './horómetro.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Horometro.name, schema: HorometroSchema },
    ]),
  ],
  controllers: [OrometroController],
  providers: [OrometroService],
  exports: [MongooseModule], // opcional si otros módulos necesitan el modelo
})
export class HorometroModule {}
 