import { HttpException } from '@nestjs/common';

export class InvariantException extends HttpException {
  constructor(message: string | Record<string, any>) {
    super(message, 400);
  }
}
