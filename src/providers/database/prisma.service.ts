import { PrismaClient, Prisma } from '@prisma/client';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit
{
  constructor(private logger: LoggerService) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
      ],
    });

    this.$on('query', (e) => {
      this.logger.log(`Query: ${e.query}`);
      this.logger.log(`Params: ${JSON.stringify(e.params)}`);
      this.logger.log(`Duration: ${e.duration}ms`);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
