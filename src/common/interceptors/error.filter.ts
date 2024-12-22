import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  BadRequestException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { formatResponse } from '../utils/response-format.util';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json(
        formatResponse(false, 'Page Not Found', `${request.url} not found`),
      );
  }
}

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Default to 500 if status is not available
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const acceptHeader = request.headers['accept'] || '';
    const expectsHtml = acceptHeader.includes('text/html');

    if (expectsHtml) {
      return this.handleHtmlResponse(response, status, exception);
    }

    return this.handleJsonResponse(response, status, exception);
  }

  private handleHtmlResponse(
    response: Response,
    status: number,
    exception: unknown,
  ): void {
    response.status(status).render('error', {
      message:
        exception instanceof Error ? exception.message : 'An error occurred',
      statusCode: status,
    });
  }

  private handleJsonResponse(
    response: Response,
    status: number,
    exception: unknown,
  ): void {
    if (exception instanceof BadRequestException) {
      const errorResponse = exception.getResponse() as any;
      const validationErrors = Array.isArray(errorResponse.message)
        ? errorResponse.message
        : [errorResponse.message];

      response
        .status(status)
        .json(formatResponse(false, 'Bad Request', validationErrors));
      return;
    }

    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse() as any;

      response
        .status(status)
        .json(
          formatResponse(
            false,
            typeof errorResponse === 'string'
              ? errorResponse
              : errorResponse.message || 'Error occurred',
            errorResponse.error || null,
          ),
        );
      return;
    }

    // Handle unknown errors
    console.error('Unhandled error:', exception);
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(formatResponse(false, 'Internal server error'));
  }
}
