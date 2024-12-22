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

A NestJS template for building server-side applications, integrated with Prisma as the ORM for database operations. This project provides a robust structure for developing scalable applications with features like authentication, email verification, and media handling.

## Features

- **NestJS Framework**: Utilizes the powerful NestJS framework for building server-side applications.
- **Prisma ORM**: Integrated with Prisma for efficient database operations.
- **Email Verification**: Sends verification emails upon user registration.
- **Media Uploads**: Supports file uploads with validation.
- **Swagger Documentation**: Automatically generates API documentation.
- **Environment Configuration**: Uses dotenv for managing environment variables.

## Project Setup

To set up the project, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/tatangdev/nestjs-api.git
cd nestjs-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and set the `DATABASE_URL` to point to your database.

## Compile and Run the Project

To compile and run the project, use the following commands:

```bash
# Development mode
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

## Prisma Setup

Make sure you have a `.env` file with the `DATABASE_URL` pointing to your database. Use the following commands to manage Prisma:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations in development
npm run prisma:migrate

# Deploy migrations in production
npm run prisma:migrate:prod

# Open Prisma Studio
npm run prisma:studio
```

## Run Tests

To run the tests, use the following commands:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
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

## Stay in Touch

- Author - [TatangDev](https://github.com/tatangdev)
- Website - [NestJS](https://nestjs.com)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

This project is [UNLICENSED](LICENSE).
