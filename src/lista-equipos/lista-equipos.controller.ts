import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ListaEquiposService } from './lista-equipos.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('lista-equipos')
@Controller('lista-equipos')
export class ListaEquiposController {
  constructor(private readonly listaEquiposService: ListaEquiposService) {}

  @Get()
  async find() {
    return await this.listaEquiposService.find();
  }

  @Post()
  async create(@Body() data: any) {
    return await this.listaEquiposService.create(data);
  }

  @Put(':id')
  async actualizarEquipo(@Param('id') id: string, @Body() data: any) {
    return this.listaEquiposService.updateById(id, data);
  }
}
