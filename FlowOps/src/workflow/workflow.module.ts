import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WorkflowController } from './controllers/workflow.controller';
import { HealthController } from './controllers/health.controller';
import { WorkflowService } from './services/workflow.service';
import { Workflow, WorkflowSchema } from './schemas/workflow.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workflow.name, schema: WorkflowSchema }
    ]),
    ClientsModule.registerAsync([
      {
        name: 'WORKFLOW_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rabbitmq.uri') || 'amqp://localhost:5672'],
            queue: configService.get<string>('rabbitmq.queueName') || 'workflows',
            queueOptions: {
              durable: true
            },
            noAck: false,
            persistent: true
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