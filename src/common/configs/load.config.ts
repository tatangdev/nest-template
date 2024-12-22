import { config as loadDotenv } from 'dotenv';
import { Environment } from '../enums/environment.enum';
import { Configuration } from '../interfaces/configuration.interface';
import { Logger } from '@nestjs/common';

loadDotenv();

const logger = new Logger('Load Config');
const env = loadDotenv();

if (env.error) {
  logger.error(env.error);
  process.exit(1);
}

export const loadConfiguration: () => Configuration = () => ({
  appName: process.env.APP_NAME || 'NestJS API',
  appDescription: process.env.APP_DESCRIPTION || 'NestJS API',
  environment: (process.env.NODE_ENV as Environment) || Environment.Development,
  port: parseInt(process.env.PORT) || 3000,
  cors: { origin: process.env.CORS_ORIGIN?.split(',') },
  databaseUrl: process.env.DATABASE_URL,
  auth: {
    passwordSaltRounds: parseInt(process.env.PASSWORD_SALT_ROUNDS) || 10,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    ignoreTLS: process.env.SMTP_IS_IGNORE_TLS === 'true',
    secure: process.env.SMTP_IS_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    from: process.env.SMTP_SENDER_MAIL,
  },
  imagekit: {
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  },
});

export const configuration = loadConfiguration();
