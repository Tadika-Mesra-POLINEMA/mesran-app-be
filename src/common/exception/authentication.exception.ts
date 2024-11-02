import { HttpException } from '@nestjs/common';

export class AuthenticationException extends HttpException {
  constructor(message: string | Record<string, any>) {
    super(message, 401);
  }
}
