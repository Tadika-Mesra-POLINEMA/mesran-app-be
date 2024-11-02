import { HttpException } from '@nestjs/common';

export class NotfoundException extends HttpException {
  constructor(message: string | Record<string, any>) {
    super(message, 404);
  }
}
