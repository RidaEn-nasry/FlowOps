import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorkflowController } from './controllers/workflow.controller';
import { HealthController } from './controllers/health.controller';
import { WorkflowService } from './services/workflow.service';
import { PrismaModule } from '../shared/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule
  ],
  controllers: [WorkflowController, HealthController],
  providers: [WorkflowService],
  exports: [WorkflowService]
})
export class WorkflowModule {} 