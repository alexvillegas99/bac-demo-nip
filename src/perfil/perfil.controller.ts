import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PerfilService } from './perfil.service';

@Controller('perfil')
export class PerfilController {
  constructor(private readonly perfilService: PerfilService) {}

  @Get()
  async find() {
    return await this.perfilService.find();
  }

  @Post()
  async create(@Body() data: any) {
    return await this.perfilService.create(data);
  }

  @Put(':id')
  async updateTask(@Param('id') id: string, @Body() data: any) {
    return this.perfilService.updateById(id, data);
  }
}
