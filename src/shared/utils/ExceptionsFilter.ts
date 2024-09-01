import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      typeof exception?.status === 'string'
        ? HttpStatus.BAD_REQUEST
        : exception?.getStatus?.();

    response.status(status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: status || 500,
      message:
        exception?.response?.error || [exception.error || exception.message] ||
        'Internal Server Error',
    });
  }
}
