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
          example: ['172.16.108.2', '192.168.1.10']
        },
        fechaInicio: {
          type: 'string',
          format: 'date-time',
          example: '2025-04-01T00:00:00.000Z'
        },
        fechaFin: {
          type: 'string',
          format: 'date-time',
          example: '2025-04-30T23:59:59.999Z'
        }
      },
      required: ['ips', 'fechaInicio', 'fechaFin']
    }
  })
  async obtenerPorFechas(@Body() body: { ips: string[], fechaInicio: string, fechaFin: string }) {
    const { ips, fechaInicio, fechaFin } = body;

    return this.service.findPorIpsYFechas(
      ips,
      new Date(fechaInicio),
      new Date(fechaFin)
    );
  }
}
