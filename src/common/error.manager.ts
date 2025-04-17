import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorManager extends Error {
  constructor({
    type,
    message,
  }: {
    type: keyof typeof HttpStatus;
    message: string;
  }) {
    super(`${type} :: ${message}`);
  }

  public static createSignatureError(message: string) {
    const name = message.split(' :: ')[0];

    if (name) {
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    } else {
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

export const MENSAJES_RESPUESTA = Object.freeze({
  ERROR: 'ko',
  EXITO: 'ok',
});
