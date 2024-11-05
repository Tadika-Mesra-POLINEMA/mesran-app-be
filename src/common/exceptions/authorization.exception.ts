import { HttpException } from '@nestjs/common';

export class AuthorizationException extends HttpException {
  constructor(message: string | Record<string, any>) {
    super(message, 403);
  }
}
