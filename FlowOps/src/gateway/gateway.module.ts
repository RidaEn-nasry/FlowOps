import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { WorkflowGatewayController } from './controllers/workflow.controller';
import { HealthGatewayController } from './controllers/health.controller';
import { GatewayService } from './services/gateway.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule
  ],
  controllers: [WorkflowGatewayController, HealthGatewayController],
  providers: [GatewayService],
  exports: [GatewayService]
})
export class GatewayModule {} 