import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistoricoPlcService } from './historico-plc.service';
import { CreateHistoricoPlcDto } from './dto/create-historico-plc.dto';
import { UpdateHistoricoPlcDto } from './dto/update-historico-plc.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
@ApiTags('historico-plc')
@Controller('historico-plc')
export class HistoricoPlcController {
  constructor(private readonly historicoPlcService: HistoricoPlcService) {}


  @Post()
  @ApiBody({
    type: Object,
    description: 'Buscar datos por ip',
    examples: {
      nickname: {
        description: 'ip del equipo',
        value: {
          ip: '192.168.100.80',
          limit: 10,
        },
      },
    },
  })
  async find(@Body() body: any) {
   
    return await this.historicoPlcService.find(body);
  }


  @Post('energia-promedio')
  @ApiBody({
    description: 'Obtener energía consumida, costo y puntos promedio por IP',
    schema: {
      example: {
        ips: ['172.16.107.5', '172.16.107.6'],
        desde: '2025-04-30',
        hasta: '2025-04-30'
      }
    }
  })
  async obtenerEnergiaPromedio(@Body() body: { ips: string[], desde: string, hasta: string }) {
    const desdeUtc = new Date(`${body.desde}T00:00:00-05:00`).toISOString();
    const hastaUtc = new Date(`${body.hasta}T23:59:59-05:00`).toISOString();
    return await this.historicoPlcService.obtenerPromedioEnergiaPorIps(body.ips, desdeUtc, hastaUtc);
  }


    @Post('energia-promedio-franjas')
  @ApiBody({
    description: 'Obtener energía consumida, costo y puntos promedio por IP y por franjas horarias',
    schema: {
      example: {
        ips: ['172.16.107.5', '172.16.107.6'],
        desde: '2025-04-30',
        hasta: '2025-04-30'
      }
    }
  })
  async obtenerEnergiaPromedioFranjas(@Body() body: { ips: string[], desde: string, hasta: string }) {
    const desdeUtc = new Date(`${body.desde}T00:00:00-05:00`).toISOString();
    const hastaUtc = new Date(`${body.hasta}T23:59:59-05:00`).toISOString();
    return await this.historicoPlcService.obtenerConsumoCostosPorFranjas(body.ips, desdeUtc, hastaUtc);
  }

}
