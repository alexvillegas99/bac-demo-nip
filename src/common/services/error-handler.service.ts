import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  NotAcceptableException,
  NotImplementedException,
  BadGatewayException,
} from '@nestjs/common';

interface ErrorMapping {
  code: number;
  exception: any;
}

@Injectable()
export class ErrorHandlerService {
  private readonly errorMappings: ErrorMapping[] = [
    { code: 202, exception: BadRequestException },
    { code: 204, exception: NotFoundException },
    { code: 400, exception: BadRequestException },
    { code: 401, exception: UnauthorizedException },
    { code: 403, exception: ForbiddenException },
    { code: 404, exception: NotFoundException },
    { code: 406, exception: NotAcceptableException },
    { code: 409, exception: ConflictException },
    { code: 500, exception: InternalServerErrorException },
    { code: 501, exception: NotImplementedException },
    { code: 502, exception: BadGatewayException },
    { code: 2627, exception: ConflictException },
    { code: 100085, exception: NotFoundException },
  ];

  public handleCustomError(error: {
    status?: number;
    statusCode?: number;
    message?: string;
  }) {
    const errorCode = Number(error.status) || Number(error.statusCode);

    // Buscar el mapeo del código de error
    const errorMapping = this.errorMappings.find(
      (mapping) => mapping.code === errorCode,
    );

    if (errorMapping) {
      // Si existe un mapeo, lanzar la excepción correspondiente
      throw new errorMapping.exception(
        error.message || 'Error procesado por el sistema',
      );
    } else {
      // Si no existe un mapeo, lanzar un error genérico
      const genericErrorResponse = {
        statusCode: 500,
        message: 'Error desconocido, contacte con el administrador',
      };
      throw new InternalServerErrorException(genericErrorResponse);
    }
  }
}
