import {
  Controller,
  Post,
  Body,
  Query,
  Put,
  Param,
  Get,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // 👉 Crear un nuevo usuario (con clave temporal y rol opcional)
  @Post()
  async crearUsuario(@Body() body: any) {
    return this.usuariosService.crearUsuario(body);
  }


  // 👉 Editar usuario por ID
  @Put(':id')
  async actualizarUsuario(@Param('id') id: string, @Body() data: any) {
    return this.usuariosService.editarUsuario(id, data);
  }

  // 👉 Activar o desactivar usuario
  @Put(':id/estado/:estado')
  async cambiarEstado(
    @Param('id') id: string,
    @Param('estado') estado: string,
  ) {
    const estadoBoolean = estado === 'true';
    return this.usuariosService.cambiarEstadoUsuario(id, estadoBoolean);
  }

  // 👉 Obtener todos los usuarios (opcional: filtrado por rol o estado)
  @Get()
  async listarUsuarios(
    @Query('rol') rol?: string,
    @Query('estado') estado?: string,
  ) {
    return this.usuariosService.listarUsuarios(rol, estado);
  }

  // 👉 Obtener un usuario por ID
  @Get(':id')
  async obtenerUsuario(@Param('id') id: string) {
    return this.usuariosService.obtenerUsuarioPorId(id);
  }
}
