import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrometroService } from './horómetro.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
@ApiTags('Horometro')
@Controller('orometro')
export class OrometroController {
  constructor(private readonly service: OrometroService) {}

  @Post('por-fechas')
  @ApiBody({
    description: 'Consulta registros agrupados por IP en un rango de fechas',
    schema: {
      type: 'object',
      properties: {
        ips: {
          type: 'array',
          items: { type: 'string' },
          example: ['172.16.108.2', '192.168.1.10'],
        },
        fechaInicio: {
          type: 'string',
          format: 'date-time',
          example: '2025-04-01T00:00:00.000Z',
        },
        fechaFin: {
          type: 'string',
          format: 'date-time',
          example: '2025-04-30T23:59:59.999Z',
        },
      },
      required: ['ips', 'fechaInicio', 'fechaFin'],
    },
  })
  async obtenerPorFechas(
    @Body() body: { ips: string[]; fechaInicio: string; fechaFin: string },
  ) {
    const { ips} = body;

  return  await this.service.findPorIpsYFechas(ips);
  }

  @Post('obtner-historial')
  @ApiBody({
    description: 'Consulta registros agrupados por IP en un rango de fechas',
    schema: {
      type: 'object',
      properties: {
        ips: {
          type: 'array',
          items: { type: 'string' },
          example: ['172.16.108.2', '192.168.1.10'],
        },
      },
      required: ['ips', 'fechaInicio', 'fechaFin'],
    },
  })
  async findHisorialPorIp(@Body() body: { ips: string[] }) {
    const { ips } = body;

    return await this.service.findHisorialPorIp(ips);
  }

  @Post('crear-historial')
  @ApiBody({
    description: 'Consulta registros agrupados por IP en un rango de fechas',
    schema: {
      type: 'object',
      properties: {
        ip: {
          type: 'string',

          example: '172.16.108.2',
        },
      },
      required: ['ips', 'fechaInicio', 'fechaFin'],
    },
  })
  async crearHistorial(@Body() body: any) {
    const { ip } = body;

    return await this.service.crearRegistroHistorico(ip);
  }
}
