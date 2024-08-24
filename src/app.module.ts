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
  ],
  controllers: [AppController],
  providers: [AppService],
 
})
export class AppModule {}
