import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, set } from 'mongoose';
import { plcData } from './entities/plc-data.entity';
import { addDays, format } from 'date-fns';
import { toDate } from 'date-fns-tz';
import { SocketsGateway } from 'src/sockets/sockets.gateway';

type Registro = plcData & Document;
@Injectable()
export class PlcDataService {
  constructor(
    @InjectModel('plc')
    private readonly plcDataBase: Model<plcData>,
  ) {
    //actualizar la data cada 5 segundos en donde la IP sea 172.16.8.9

    setInterval(async () => {
      // Calcular de forma aleatoria corriente, frecuencia, potencia, voltaje, processValue
      const corriente = Math.floor(Math.random() * 100) + 1;
      const voltaje = Math.floor(Math.random() * 220) + 1;
      const frecuencia = Math.floor(Math.random() * 60) + 1;
      const potencia = Math.floor(Math.random() * 1000) + 1;
      const processValue = Math.floor(Math.random() * 100) + 1;

      // Suponiendo que siempre actualizas un documento específico por su _id o algún identificador único
      await this.plcDataBase.findOneAndUpdate(
        { IP: '172.16.8.9' }, // filtro
        {
          $set: {
            Data: {
              corriente,
              voltaje,
              frecuencia,
              potencia,
              processValue,
              timestamp: new Date(),
            },
          },
        },
        { upsert: true, new: true },
      );
      console.log('Data updated successfully!');
    }, 5000);
  }

  async find(body: any) {
    try {
      const data = await this.plcDataBase.find({ IP: body.ip }).exec();
      return data[0];
    } catch (error) {
      return null;
    }
  }
}
