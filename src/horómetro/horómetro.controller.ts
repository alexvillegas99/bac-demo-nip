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

@Controller('orometro')
export class OrometroController {
  constructor(private readonly service: OrometroService) {}

  @Post()
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('ip/:ip')
  findByIp(@Param('ip') ip: string) {
    return this.service.findByIp(ip);
  }

  @Patch('sumar-tiempo/:ip')
  sumarTiempo(@Param('ip') ip: string, @Body('segundos') segundos: number) {
    return this.service.updateTiempo(ip, segundos);
  }

  @Patch(':ip')
  update(@Param('ip') ip: string, @Body() dto: any) {
    return this.service.update(ip, dto);
  }
}
