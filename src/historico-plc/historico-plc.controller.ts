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

}
