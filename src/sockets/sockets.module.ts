import { Module } from "@nestjs/common";
import { SocketsGateway } from "./sockets.gateway";
import { PlcDataModule } from "src/plc-data/plc-data.module";

@Module({
    imports: [PlcDataModule],
    controllers: [],
    providers: [SocketsGateway],
  })
  export class SocketsModule {}