import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PerfilService } from 'src/perfil/perfil.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class AuthService {
  logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usuariosService: UsuariosService,
    private readonly _perfilService: PerfilService,
    // private readonly mailService: MailService,
  ) {}

  async login({ correo, clave }: { correo: string; clave: string }) {
    const user: any = await this.usuariosService.findByEmail(correo);

    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    if (!user.estado) throw new UnauthorizedException('Usuario inactivo');

    const isPasswordValid = user.claveTemporal === clave ? true : false;

    delete user.clave;
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const payload = { sub: user._id };
    const accessToken = this.jwtService.sign(payload);

    let permisos: any = await this._perfilService.findByName(user.rol);
    permisos = permisos[0].permisos;
    permisos = permisos
      .filter((permiso) => permiso.estado)
      .map((permiso) => permiso.descripcion);

    return {
      accessToken,
      user: user,
      permisos,
    };
  }

  generateRefreshToken(userId: string) {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, { expiresIn: '7d' }); // Refresh token válido por 7 días
  }

  renewToken(id: string) {
    try {
      const payload = { sub: id };
      return this.jwtService.sign(payload);
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }
}
