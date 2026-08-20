import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { AppModule } from './app.module';

const envFilePath =
  process.env.APP_ENV === 'railway'
    ? resolve(process.cwd(), '.env.railway')
    : (existsSync(resolve(process.cwd(), '.env.local'))
        ? resolve(process.cwd(), '.env.local')
        : resolve(process.cwd(), '.env'));

dotenv.config({ path: envFilePath, override: true });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(
    json({
      verify: (request: any, _response, buffer) => {
        request.rawBody = buffer;
      },
    }),
  );
  app.use(helmet());
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://www.oyerohini.com',
      'https://oyerohini.com',
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
}

bootstrap();
