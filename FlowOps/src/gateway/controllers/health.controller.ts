import { Controller, Get, Logger } from '@nestjs/common';
import { GatewayService } from '../services/gateway.service';

/**
 * Gateway controller for health checks
 */
@Controller('api/v1/health')
export class HealthGatewayController {
  private readonly logger = new Logger(HealthGatewayController.name);

  constructor(private readonly gatewayService: GatewayService) {}

  /**
   * Check health of all services
   */
  @Get()
  async getHealthStatus() {
    this.logger.log('Gateway received health check request');
    return this.gatewayService.getHealthStatus();
  }
} 