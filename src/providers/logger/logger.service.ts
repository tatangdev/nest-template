import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { js_beautify } from 'js-beautify';
import * as chalk from 'chalk';
import { Environment } from 'src/common/enums/environment.enum';
import { Configuration } from 'src/common/interfaces/configuration.interface';

interface PrismaQueryLog {
  model: string;
  action: string;
  args: Record<string, any>;
  duration: number;
  timestamp: string;
}

interface RequestLog {
  timestamp: string;
  method: string;
  path: string;
  queryParams?: Record<string, any>;
  body?: any;
}

interface ResponseLog extends Omit<RequestLog, 'queryParams'> {
  statusCode: number;
  duration: string;
  body?: any;
}

@Injectable()
export class LoggerService extends Logger {
  private readonly isProd: boolean;
  private sensitiveFields: Set<string> = new Set([
    'password',
    'token',
    'authorization',
    'apikey',
    'api_key',
    'secret',
    'credential',
    'accesstoken',
    'access_token',
    'refreshtoken',
    'refresh_token',
    'private_key',
    'privatekey',
    'ssn',
    'creditcard',
    'credit_card',
  ]);
  private readonly beautifyOptions = { indent_size: 2 };
  private readonly defaultContext = 'LoggerService';

  constructor(private readonly configService: ConfigService<Configuration>) {
    super();
    this.isProd =
      this.configService.get('environment') === Environment.Production;
  }

  logPrismaQuery({
    model,
    action,
    args,
    duration,
    timestamp,
  }: PrismaQueryLog): void {
    if (this.isProd) return;

    const query = this.constructQueryString(model, action, args);
    const logMessage = `Prisma Query: ${query}`;
    const logContext = 'PrismaMiddleware';
    const logData = {
      type: 'prisma_query',
      model,
      action,
      args: this.sanitizeBody(args),
      duration,
      timestamp,
    };

    this.log(logMessage, { rawQuery: query, duration, timestamp }, logContext);
  }

  logHttpRequest(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    if (this.isProd) {
      next();
      return;
    }

    try {
      const startTime = Date.now();
      const {
        method,
        query: queryParams,
        baseUrl: path,
        originalUrl,
      } = request;
      const requestPath = path || originalUrl;

      this.logRequestDetails(
        this.createRequestLog(method, requestPath, queryParams, request.body),
      );
      this.setupResponseLogging(response, method, requestPath, startTime);
      this.captureResponseBody(response);

      next();
    } catch (error) {
      this.error(
        `Error logging HTTP request: ${error.message}`,
        error.stack,
        this.defaultContext,
      );
      next();
    }
  }

  private createRequestLog(
    method: string,
    path: string,
    queryParams: Record<string, any>,
    body: any,
  ): RequestLog {
    return {
      timestamp: new Date().toISOString(),
      method,
      path,
      ...(Object.keys(queryParams || {}).length && { queryParams }),
      ...(body && { body: this.sanitizeBody(body) }),
    };
  }

  private createResponseLog(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    body?: any,
  ): ResponseLog {
    return {
      timestamp: new Date().toISOString(),
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
      ...(body && { body: this.sanitizeBody(body) }),
    };
  }

  private logRequestDetails(requestLog: RequestLog): void {
    const formattedLog = this.formatLog(requestLog);
    this.logRequest(`${requestLog.method} ${requestLog.path}\n${formattedLog}`);
  }

  private setupResponseLogging(
    response: Response,
    method: string,
    path: string,
    startTime: number,
  ): void {
    response.on('finish', () => {
      const duration = Date.now() - startTime;
      const responseLog = this.createResponseLog(
        method,
        path,
        response.statusCode,
        duration,
        response['body'],
      );

      const formattedLog = this.formatLog(responseLog);
      this.logResponse(
        `${method} ${path} ${response.statusCode} ${responseLog.duration}\n${formattedLog}`,
      );
    });
  }

  private formatLog(log: RequestLog | ResponseLog): string {
    return chalk.gray(js_beautify(JSON.stringify(log), this.beautifyOptions));
  }

  private captureResponseBody(response: Response): void {
    const originalSend = response.send;
    response.send = function (body) {
      response['body'] = body;
      return originalSend.call(this, body);
    };
  }

  private logRequest(message: string): void {
    super.log(chalk.blueBright(`→ ${message}`), this.defaultContext);
  }

  private logResponse(message: string): void {
    super.log(chalk.greenBright(`← ${message}`), this.defaultContext);
  }

  private sanitizeBody(body: any): any {
    if (!body) return null;

    if (typeof body !== 'object') {
      try {
        return JSON.parse(body);
      } catch {
        return body;
      }
    }

    return this.sanitizeObject({ ...body });
  }

  private sanitizeObject(obj: Record<string, any>): Record<string, any> {
    for (const [key, value] of Object.entries(obj)) {
      if (this.sensitiveFields.has(key.toLowerCase())) {
        obj[key] = '[REDACTED]';
      } else if (value && typeof value === 'object') {
        obj[key] = this.sanitizeObject(value);
      }
    }
    return obj;
  }

  private constructQueryString(
    model: string,
    action: string,
    args: Record<string, any>,
  ): string {
    return `${action} on ${model} with args: ${JSON.stringify(args)}`;
  }
}
