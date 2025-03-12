import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { WorkflowModule } from '../src/workflow/workflow.module';
import { GatewayModule } from '../src/gateway/gateway.module';
import configuration from '../src/config/configuration';

/**
 * Test module for e2e tests
 * Mocks external dependencies like RabbitMQ
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/flowops-test'),
    ClientsModule.register([
      {
        name: 'WORKFLOW_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'workflows',
          queueOptions: {
            durable: true
          },
          noAck: false,
          persistent: true
        }
      }
    ]),
    HttpModule,
    WorkflowModule,
    GatewayModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class TestModule {} 