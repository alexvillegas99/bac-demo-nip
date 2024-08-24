import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IpEquipoService } from './ip-equipo.service';
import { CreateIpEquipoDto } from './dto/create-ip-equipo.dto';
import { UpdateIpEquipoDto } from './dto/update-ip-equipo.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('ip-equipo')
@Controller('ip-equipo')
export class IpEquipoController {
  constructor(private readonly ipEquipoService: IpEquipoService) {}



  @Get()
  async find() {
    return await this.ipEquipoService.find();
  }

 

}
