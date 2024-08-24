import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; // Importa Socket desde 'socket.io'
import { PlcDataService } from '../plc-data/plc-data.service';
import { HistoricoPlcService } from 'src/historico-plc/historico-plc.service';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway(3000, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['content-type'],
  },
})
export class SocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly plcDataService: PlcDataService,
    private readonly historicoPlcService: HistoricoPlcService,
    private readonly configService:ConfigService
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('findPlcData')
  async handleFindPlcData(
    @MessageBody() data: { ip: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Client:', client.id);
    try {
      const result = await this.plcDataService.find(data);
      console.log('Sending data to client:');
      client.emit('findPlcDataResponse', result); // Usa emit para enviar datos al cliente
    } catch (error) {
      console.error('Error in WebSocket handler:', error);
      client.emit('findPlcDataResponse', {
        error: 'An error occurred while fetching data.',
      });
    }
  }
  @SubscribeMessage('findHistoricoPlcData')
  async handleFindHistoricoPlcData(
    @MessageBody() data: { ip: string; limit?: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Client:', client.id);
    try {
      const result = await this.historicoPlcService.find(data);
      console.log('Sending historical PLC data to client:', result);
      client.emit('findHistoricoPlcDataResponse', result);
    } catch (error) {
      console.error('Error in WebSocket handler:', error);
      client.emit('findHistoricoPlcDataResponse', {
        error: 'An error occurred while fetching historical PLC data.',
      });
    }
  }
}
