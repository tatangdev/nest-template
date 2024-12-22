import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { PrismaService } from './database/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import {
  ErrorFilter,
  NotFoundExceptionFilter,
} from 'src/common/interceptors/error.filter';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { MailService } from './mailer/nodemailer.service';
import { Configuration } from 'src/common/interfaces/configuration.interface';
import { ImagekitService } from './media-handler/imagekit.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<Configuration>) => ({
        transport: {
          host: configService.get('smtp.host', { infer: true }),
          port: configService.get('smtp.port', { infer: true }),
          ignoreTLS: configService.get('smtp.ignoreTLS', { infer: true }),
          secure: configService.get('smtp.secure', { infer: true }),
          auth: {
            user: configService.get('smtp.auth.user', { infer: true }),
            pass: configService.get('smtp.auth.pass', { infer: true }),
          },
        },
        preview: false,
        template: {
          dir: join(__dirname, '../src/providers/mailer/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    LoggerService,
    PrismaService,
    MailService,
    ImagekitService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
  ],
  exports: [LoggerService, PrismaService, MailService, ImagekitService],
})
export class ProvidersModule {}
