import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from 'src/config/config.env';
import { JwtModule } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class AuthService {
  logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usuariosService: UsuariosService,
   // private readonly mailService: MailService,
  ) {}

  async login({ correo, clave }: { correo: string; clave: string }) {
    console.log('correo', correo);
    console.log('clave', clave);
    const user:any = await this.usuariosService.findByEmail(correo);

    if (!user) throw new UnauthorizedException('Credenciales incorrectas');
    //const isPasswordValid = await bcrypt.compare(clave, user.clave);
    //isPasswordValid =  user.clave ===clave ? true : false;


    //console.log('isPasswordValid', isPasswordValid);
    const isPasswordValid = user.claveTemporal === clave ? true : false;

    delete user.clave;
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const payload = { sub: user._id };
    const accessToken = this.jwtService.sign(payload);
     //fecha con formato dd/mm/yyyy hh:mm:ss
        const fecha = new Date().toLocaleString();
        console.log(fecha);
  /*   const html = this.mailService.getTemplate('login.html', {
      nombre: user.nombre,
      fecha: fecha,
    });

    await this.mailService.enviar(user.correo, 'Inicio de sesión', html); */
    return {
      accessToken,
      user: user,
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
