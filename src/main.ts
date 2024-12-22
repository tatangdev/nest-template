import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Environment } from './common/enums/environment.enum';
import { Configuration } from './common/interfaces/configuration.interface';
import { setupSwagger } from './common/configs/swagger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: determineLogger(),
  });

  const configService = app.get(ConfigService<Configuration>);
  configureApp(app, configService);

  app.useStaticAssets(join(__dirname, '../public'));
  app.setBaseViewsDir(join(__dirname, '../src/common/views'));
  app.setViewEngine('hbs');

  await app.listen(configService.get<number>('port', { infer: true }));
}

function determineLogger(): ('log' | 'error' | 'warn' | 'debug' | 'verbose')[] {
  const env = process.env.NODE_ENV;
  return env === Environment.Development
    ? ['log', 'error', 'warn', 'debug', 'verbose']
    : ['log', 'error', 'warn'];
}

function configureApp(
  app: NestExpressApplication,
  configService: ConfigService<Configuration>,
) {
  const corsOrigin = configService.get<string | string[]>('cors.origin', {
    infer: true,
  });
  const environment = configService.get<Environment>('environment', {
    infer: true,
  });

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  if (environment === Environment.Development) {
    setupSwagger(app);
  }
}

bootstrap();
