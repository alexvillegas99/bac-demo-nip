import { Controller, Get } from '@nestjs/common';
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

}
