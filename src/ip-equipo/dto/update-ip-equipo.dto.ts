import { PartialType } from '@nestjs/swagger';
import { CreateIpEquipoDto } from './create-ip-equipo.dto';

export class UpdateIpEquipoDto extends PartialType(CreateIpEquipoDto) {}
