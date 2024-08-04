import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server} from 'socket.io';
import { Interval } from '@nestjs/schedule';
import { PlcDataService } from "src/plc-data/plc-data.service";
@WebSocketGateway()
export class SocketsGateway implements OnGatewayConnection , OnGatewayConnection{
    constructor( private readonly plcdataService: PlcDataService){
       
    }

    @WebSocketServer()
    server:Server;

    async handleConnection(client: any, ...args: any[]) {
        console.log('client connected' + client.id)
        const newData = await this.plcdataService.findAll();
        // Luego, puedes emitir los nuevos datos a todos los clientes conectados
        this.server.emit('data_plc', newData);
        this.server.emit('message', "sss")
    }
    handleDisconnect(client: any) {
        console.log('client disconnected' + client.id)
    } 
  
    @SubscribeMessage('message')
    handleMessage(client: any, payload: any) {
        console.log(payload)
       this.server.emit('message', payload)
      
    }

    @Interval(1000) // Intervalo de 10 segundos
    async sendUpdatesToClients() {
        // Aquí puedes obtener los nuevos datos de tu servicio de base de datos
        const newData = await this.plcdataService.findAll();
        console.log(`Sending new data to clients: ${newData.length} records`)
        // Luego, puedes emitir los nuevos datos a todos los clientes conectados
        this.server.emit('newData', newData);
    }
  
}