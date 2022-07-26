import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 400) {
      const errorResponse = {
        errors: [],
      };

      const responseBody: any = exception.getResponse();
      responseBody.message.forEach((m) => errorResponse.errors.push(m));
      response.status(status).json(errorResponse);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}

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

export const exceptionFilters = [
  new HttpExceptionFilter(),
  new ErrorExceptionFilter(),
];
