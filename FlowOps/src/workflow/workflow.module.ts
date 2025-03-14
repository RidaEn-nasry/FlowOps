import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WorkflowController } from './controllers/workflow.controller';
import { HealthController } from './controllers/health.controller';
import { WorkflowService } from './services/workflow.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'WORKFLOW_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rabbitmq.uri') || ''],
            queue: configService.get<string>('rabbitmq.queues.workflow') || '',
            queueOptions: {
              durable: true
            },
            exchange: configService.get<string>('rabbitmq.exchange') || '',
            noAck: false
          }
        })
      }
    ])
  ],
  controllers: [WorkflowController, HealthController],
  providers: [WorkflowService],
  exports: [WorkflowService]
})
export class WorkflowModule {} 