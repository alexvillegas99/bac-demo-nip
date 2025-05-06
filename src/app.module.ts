import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { MONGODB_URI } from './config/config.env';
import { SocketsModule } from './sockets/sockets.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PlcDataModule } from './plc-data/plc-data.module';
import { HistoricoPlcModule } from './historico-plc/historico-plc.module';
import { IpEquipoModule } from './ip-equipo/ip-equipo.module';
import { ListaEquiposModule } from './lista-equipos/lista-equipos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { HorometroModule } from './horómetro/horómetro.module';
import { TareasModule } from './tareas/tareas.module';
import { AmazonS3Module } from './amazon-s3/amazon-s3.module';
import { MailModule } from './mail/mail.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>(MONGODB_URI),
        };
      },
    }),
    SocketsModule,
    PlcDataModule,
    HistoricoPlcModule,
    IpEquipoModule,
    ListaEquiposModule,
    UsuariosModule,
    AuthModule,
    UsuariosModule,
    HorometroModule,
    TareasModule,
    AmazonS3Module,
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
