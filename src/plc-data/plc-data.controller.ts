import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlcDataService } from './plc-data.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
@ApiTags('plc')
@Controller('plc-data')
export class PlcDataController {
  constructor(private readonly plcDataService: PlcDataService) {}


  @Post()
  @ApiBody({
    type: Object,
    description: 'Buscar datos por ip',
    examples: {
      nickname: {
        description: 'ip del equipo',
        value: {
          ip: '192.168.100.80',
        },
      },
    },
  })
  async find(@Body() body: any) {
    return await this.plcDataService.find(body);
  }


}
