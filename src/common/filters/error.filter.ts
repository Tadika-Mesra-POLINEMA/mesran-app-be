import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Errors } from 'src/app.dto';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

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
