import { PartialType } from '@nestjs/swagger';
import { CreateHistoricoPlcDto } from './create-historico-plc.dto';

export class UpdateHistoricoPlcDto extends PartialType(CreateHistoricoPlcDto) {}
