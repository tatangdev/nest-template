import { Environment } from '../enums/environment.enum';

export interface Configuration {
  appName: string;
  appDescription: string;
  environment: Environment;
  port: number;
  cors: { origin: string[] };
  databaseUrl: string;
  auth: {
    passwordSaltRounds: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  smtp: {
    host: string;
    port: number;
    ignoreTLS: boolean;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    from: string;
  };
  imagekit: {
    publicKey: string;
    privateKey: string;
    urlEndpoint: string;
  };
}
