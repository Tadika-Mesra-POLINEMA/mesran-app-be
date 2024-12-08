import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Errors } from 'src/app.dto';
import { Logger } from 'winston';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    this.logger.error('Bad Request: ', exception);

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        status: 'fail',
        message: exception.message,
      });
    } else if (exception instanceof ZodError) {
      const formattedErrors: Errors = {};

      exception.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!formattedErrors[path]) {
          formattedErrors[path] = [];
        }
        formattedErrors[path].push(err.message);
      });

      response.status(400).json({
        status: 'error',
        message: 'Bad request',
        errors: formattedErrors,
      });
    } else {
      response.status(500).json({
        status: 'error',
        message: 'There is some problem with the server.',
      });
    }
  }
}
