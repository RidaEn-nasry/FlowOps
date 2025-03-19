import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { WorkflowModule } from '../src/workflow/workflow.module';
import configuration from '../src/config/configuration';

/**
 * Test module for e2e tests
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/flowops-test'),
    HttpModule,
    WorkflowModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class TestModule {} 