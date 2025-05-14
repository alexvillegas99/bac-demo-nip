import { Module } from '@nestjs/common';
import { PerfilController } from './perfil.controller';
import { PerfilService } from './perfil.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PerfilSchema } from './schema/perfil.schema';
import { ErrorHandlerService } from 'src/common/services/error-handler.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'perfil', schema: PerfilSchema }]),
  ],
  controllers: [PerfilController],
  providers: [PerfilService, ErrorHandlerService],
  exports: [PerfilService],
})
export class PerfilModule {}
