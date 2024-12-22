<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications with Prisma ORM.</p>
<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://github.com/tatangdev/nestjs-api/actions" target="_blank"><img src="https://github.com/tatangdev/nestjs-api/workflows/CI/badge.svg" alt="CI Build" /></a>
</p>

## Description

A NestJS template for building server-side applications, integrated with Prisma as the ORM for database operations.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Prisma setup

Make sure you have a `.env` file with the `DATABASE_URL` pointing to your database. Use the following commands to manage Prisma:

```bash
# Generate Prisma Client
$ npm run prisma:generate

# Run migrations in development
$ npm run prisma:migrate

# Deploy migrations in production
$ npm run prisma:migrate:prod

# Open Prisma Studio
$ npm run prisma:studio
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When deploying your application, ensure it runs efficiently by following the [deployment guide](https://docs.nestjs.com/deployment).

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Discord Channel](https://discord.gg/G7Qnnhy) for questions and support
- [NestJS Video Courses](https://courses.nestjs.com)
- [NestJS Devtools](https://devtools.nestjs.com) for real-time visualization
- [NestJS Enterprise Support](https://enterprise.nestjs.com)

## Stay in touch

- Author - [TatangDev](https://github.com/tatangdev)
- Website - [NestJS](https://nestjs.com)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

This project is [UNLICENSED](LICENSE).
