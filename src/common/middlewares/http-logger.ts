import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from 'src/providers/logger/logger.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}
  use(request: Request, response: Response, next: NextFunction): void {
    this.logger.logHttpRequest(request, response, next);
  }
}
