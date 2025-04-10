import { Module } from '@nestjs/common';
import { OrometroController } from './horómetro.controller';
import { OrometroService } from './horómetro.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Orometro, OrometroSchema } from './schema/orometro.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orometro.name, schema: OrometroSchema },
    ]),
  ],
  controllers: [OrometroController],
  providers: [OrometroService],
})
export class HorómetroModule {}
