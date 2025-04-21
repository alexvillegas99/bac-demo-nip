import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TareaService } from './tareas.service';

@Controller('tareas')
export class TareasController {
  constructor(private readonly tareaService: TareaService) {}

  @Get()
  async find() {
    return await this.tareaService.find();
  }

  @Post()
  async create(@Body() data: any) {
    return await this.tareaService.create(data);
  }

  @Put(':id')
  async updateTask(@Param('id') id: string, @Body() data: any) {
    return this.tareaService.updateById(id, data);
  }

  @Put('subtask/:id')
  async updateSubtask(@Param('id') id: string, @Body() data: any) {
    return this.tareaService.updateSubtaskById(id, data._id, data);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.tareaService.deleteById(id);
  }

  @Get(':id')
  async findSubtask(@Param('id') id: string) {
    return await this.tareaService.findSubtask(id);
  }
}
