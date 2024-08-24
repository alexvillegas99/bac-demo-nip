import { Module } from "@nestjs/common";
import { SocketsGateway } from "./sockets.gateway";
import { PlcDataModule } from "src/plc-data/plc-data.module";
import { HistoricoPlcModule } from "src/historico-plc/historico-plc.module";

@Module({
    imports: [PlcDataModule,HistoricoPlcModule],
    controllers: [],
    providers: [SocketsGateway],
  })
  export class SocketsModule {}