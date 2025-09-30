import { Controller, Get, Patch, Param, Query, Body } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionStatus } from './entities/notificacione.entity';
import { ApiTags } from '@nestjs/swagger';
@ApiTags()
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly svc: NotificacionesService) {}

@Get()
  async listar(
    @Query('status') status?: string,
    @Query('ip') ip?: string,
    @Query('tipo') tipo?: string,
    @Query('register') register?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedStatus = status
      ? (status.split(',').map(s => s.trim()) as NotificacionStatus[])
      : undefined;

    return this.svc.listar({ status: parsedStatus, ip, tipo, register, desde, hasta, limit: Number(limit) || 100 });
  }

  @Patch(':id/estado')
  async cambiarEstado(@Param('id') id: string, @Body() dto: any) {
    return this.svc.cambiarEstado(id, dto.status, dto.usuarioResponsable, dto.ignoreForHours);
  }
}
