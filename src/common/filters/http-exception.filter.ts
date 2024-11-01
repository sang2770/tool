import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException
} from '@nestjs/common';
import { ResponseWrapper } from '../model/response';
import { Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();
    let message;
    if (typeof errorResponse === 'string') {
      message = errorResponse;
    } else if (errorResponse instanceof Object) {
      const messageList = errorResponse['message'];
      if (Array.isArray(messageList)) {
        message = messageList.join(',');
      } else {
        message = errorResponse['message'];
      }
    }

    response.status(status).json(ResponseWrapper.fail(message, status));
  }
}
