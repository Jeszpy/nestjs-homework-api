import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    if (process.env.enviroment !== 'production') {
      const error = exception.toString();
      if (error === 'ForbiddenException: Forbidden resource') {
        return response.status(403).send();
      }
      const stack = exception.stack;
      let status;
      try {
        status = exception.getStatus();
      } catch (e) {
        status = 500;
      }
      response.status(status).send({ error, stack });
    } else {
      response.status(500).send('Some server error');
    }
  }
}
