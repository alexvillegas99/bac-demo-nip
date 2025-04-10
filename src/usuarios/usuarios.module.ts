import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioModelName, UsuarioSchema } from './schema/usuario.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
          { name: UsuarioModelName, schema: UsuarioSchema },
        ]), // Configura el modelo y el esquema de MongoDB
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], // Exporta el servicio para que pueda ser utilizado en otros módulos
})
export class UsuariosModule {}
