import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plcData } from './entities/plc-data.entity';
import { addDays, format } from 'date-fns';
import { toDate } from 'date-fns-tz';

type Registro = plcData & Document;
@Injectable()
export class PlcDataService {
  async buscarUltimoRegistro() {
   try {
    //Buscar el ultimo registro insertado

    const data =  await this.plcDataBase.find().sort({fecha: -1}).limit(1).lean().exec();
    console.log(data[0]); 
    return data[0];

   } catch (error) {
    throw error;
   }
  }
  constructor(
    @InjectModel('plc') // Inyecta el modelo de MongoDB
    private readonly plcDataBase: Model<plcData>,
  ) {
 /*   setInterval(() => {
 this.create({
        st_vdf: (Math.random() * 10).toFixed(2),
        potencia: (Math.random() * 10).toFixed(2),
        corriente: (Math.random() * 10).toFixed(2),
        temperatura: (Math.random() * 10).toFixed(2),
        voltaje: (Math.random() * 10).toFixed(2),
        rpm: (Math.random() * 10).toFixed(2),
        createdAt: new Date(),
      });
    }, 5000);   */
  }
  create(createPlcDataDto: any) { 
    try {
      const createdPlcData = new this.plcDataBase(createPlcDataDto);
      return createdPlcData.save(); 
    } catch (error) {}
  }

  async findAll(startTime?: Date, endTime?: Date): Promise<any> {
    try {
      let query = {};

      // Construye la consulta para filtrar por startTime y endTime si están presentes
      if (startTime && endTime) {
        query = { createdAt: { $gte: startTime, $lte: endTime } };
      } else if (startTime) {
        query = { createdAt: { $gte: startTime } };
      } else {
        const date = new Date();
        let last3Months = new Date(date.getTime());
        last3Months.setMonth(last3Months.getMonth() - 4);
        console.log(last3Months, date);
        //  query = { createdAt: { $gte: last3Months, $lte: date } };
      }

      // Ejecuta la consulta
      let registros = await this.plcDataBase.find(query).lean().exec();
      

      console.log(registros.length);
      const umbralMaximo = 10;

      // Calcular el tamaño del array de registros
      const tamañoArray = registros.length;

      // Si el tamaño del array es mayor que el umbral máximo, calculamos el promedio
      if (tamañoArray > umbralMaximo) {
        const tamañoParte = Math.ceil(tamañoArray / 10); // Tamaño de cada parte
        const partes = [];
        for (let i = 0; i < tamañoArray; i += tamañoParte) {
          partes.push(registros.slice(i, i + tamañoParte));
        }

        // Calcular el promedio de cada campo para cada parte
        const promedios = partes.map((part: any[]) => {
          const promedioPorCampo: { [campo: string]: number } = {};
          part.forEach((documento: any) => {
            Object.entries(documento).forEach(
              ([campo, valor]: [string, any]) => {
                // Ignorar _id y __v
                if (campo !== '_id' && campo !== '__v') {
                  // Inicializar el campo en el objeto de promedios si es la primera vez que aparece
                  if (!promedioPorCampo[campo]) {
                    promedioPorCampo[campo] = 0;
                  }
                  // Almacenar el valor del campo
                  promedioPorCampo[campo] += Number(valor);
                }
              },
            );
          });

          // Calcular el promedio para cada campo
          Object.entries(promedioPorCampo).forEach(
            ([campo, total]: [string, number]) => {
              const promedio = total / part.length;
              promedioPorCampo[campo] = Number(promedio.toFixed(2));
            },
          );

          return promedioPorCampo;
        });

        // Convertir createdAt a fecha para cada registro en promedios
        promedios.forEach((registro: any) => {
          registro.createdAt = new Date(registro.createdAt);
        });

        // Devolver los promedios
        console.log(promedios.length)
        return promedios;
      } else {
        // Si el tamaño del array es igual o menor que el umbral máximo, devolver el array original
        return registros;
      }
    } catch (error) {
      throw error;
    }
  }
  async findLastTen(): Promise<any> {
    try {
      // Buscar los últimos 10 registros ordenados por createdAt en orden descendente
      let registros = await this.plcDataBase.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .lean()
        .exec();
  
      // Ordenar los registros en orden ascendente por createdAt para que los registros estén en el orden correcto
      registros = registros.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
      return registros;
    } catch (error) {
      throw error;
    }
  }
}
