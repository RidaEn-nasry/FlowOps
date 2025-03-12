import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true
  }));
  
  // Configure CORS
  app.enableCors({
    origin: configService.get<string[]>('cors.origins') || ['*'],
    methods: configService.get<string[]>('cors.methods') || ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: configService.get<boolean>('cors.credentials') || false,
    allowedHeaders: configService.get<string[]>('cors.headers') || ['Content-Type', 'Authorization']
  });
  
  // Get application configuration
  const host = configService.get<string>('app.host') || '0.0.0.0';
  const port = configService.get<number>('app.port') || 3000;
  
  await app.listen(port, host);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap(); 