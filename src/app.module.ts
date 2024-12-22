import {
  Logger,
  MiddlewareConsumer,
  Module,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { HttpLoggerMiddleware } from './common/middlewares/http-logger';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { loadConfiguration } from './common/configs/load.config';
import { Configuration } from './common/interfaces/configuration.interface';
import { JwtModule } from '@nestjs/jwt';
import { AppRoutingModule } from './app-routing.module';
import { ProvidersModule } from './providers/providers.module';
import { PrismaService } from './providers/database/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';

@Module({
  imports: [
    ProvidersModule,
    AppRoutingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadConfiguration],
      cache: true,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Configuration>) => ({
        secret: configService.get('jwt.secret', { infer: true }),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn', { infer: true }),
          algorithm: 'HS256',
        },
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger('AppModule');
  private connectionTimeout: NodeJS.Timeout;

  constructor(private readonly prismaService: PrismaService) {}

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async onApplicationShutdown() {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }
    await this.prismaService.$disconnect();
    this.logger.log('Database connection closed gracefully');
  }

  private async connectWithRetry(retries = 5, delay = 5000): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.prismaService.$connect();
        await this.prismaService.$queryRaw`SELECT 1`;
        this.logger.log('Database connection established successfully');
        return;
      } catch (error) {
        if (attempt === retries) {
          this.logger.error(
            `Failed to connect to database after ${retries} attempts:`,
            error,
          );
          process.exit(1);
        }
        this.logger.warn(
          `Connection attempt ${attempt} failed. Retrying in ${delay / 1000}s...`,
        );
        await new Promise((resolve) => {
          this.connectionTimeout = setTimeout(resolve, delay);
        });
      }
    }
  }
}
