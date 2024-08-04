import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlcDataService } from './plc-data.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('plc')
@Controller('plc-data')
export class PlcDataController {
  constructor(private readonly plcDataService: PlcDataService) {}


  @Get()
  async findAll() {
    return await this.plcDataService.findLastTen();
  }

  @Post()
  async create(@Body() createPlcDataDto: any) {
    return await this.plcDataService.create(createPlcDataDto);
  }

  @Get('ultimo')
  async buscarUltimoRegistro() {
    return await this.plcDataService.buscarUltimoRegistro();
  }

}
