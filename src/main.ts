import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { initSwagger } from './app.swagger';
import { urlencoded, json } from 'express';
import { NODE_ENV, PORT, PORT_SOCKET } from './config/config.env';
import { ConfigService } from '@nestjs/config';

import * as express from 'express';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as fs from "fs";
import * as https from "https";
import {join} from 'path';
/* const httpsOptions = {
  pfx: fs.readFileSync(
      join(__dirname, "certificates", 'servidor.pfx')
  ),
  passphrase: 'servidor2023',
}; */
async function bootstrap() {
  const server = express();

  const logger = new Logger();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server), 
  );
  //tamaño de json
  app.use(json({ limit: '150mb' }));
  app.use(urlencoded({ extended: true, limit: '150mb' }));
  //Cors
  app.enableCors();
  //Prefijo Global de la api
  app.setGlobalPrefix('api');
  // Configuración de CORS
  app.enableCors({ 
    origin: '*', //
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });

  

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const config = app.get(ConfigService);
  const port = config.get(PORT);
  const nodeEnv = config.get(NODE_ENV);
  initSwagger(app);
  await app.listen(port);

/*   const serverHttps = https.createServer(httpsOptions, server);
  serverHttps.listen(3000); */
  logger.log(`Running in ${nodeEnv} mode`);
  logger.log(`App running in ${await app.getUrl()}/api`);
  logger.log(await `Swagger running in http://localhost:${port}/docs`);
  logger.log(`WebSocket server running on ws://localhost:${3000}`);
} 
bootstrap();
