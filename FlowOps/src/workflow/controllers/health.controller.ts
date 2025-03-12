import { Controller, Get, HttpStatus } from '@nestjs/common';

/**
 * Controller for health checks
 */
@Controller('api/v1/health')
export class HealthController {
  /**
   * Check if the service is running
   */
  @Get()
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'workflow-service',
      uptime: process.uptime()
    };
  }
} 