import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Application info
  const appName = configService.get<string>('app.name');
  const appVersion = configService.get<string>('app.version');
  const environment = configService.get<string>('app.environment');
  
  logger.log(`Starting ${appName} v${appVersion} in ${environment} mode`);
  
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
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap(); 