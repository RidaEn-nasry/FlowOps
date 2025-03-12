import { Injectable, Logger } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { WorkflowCreateDto, WorkflowResponseDto } from '../../shared/dto/workflow.dto';
import { IGatewayService } from '../interfaces/gateway.interface';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class GatewayService implements IGatewayService {
  private readonly logger = new Logger(GatewayService.name);
  private readonly workflowServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.workflowServiceUrl = this.configService.get<string>('services.workflow.url') || 'http://localhost:3001';
    this.logger.log(`Workflow service URL: ${this.workflowServiceUrl}`);
  }

  /**
   * Forward request to create a new workflow
   * @param workflowDto The workflow data to create
   */
  async createWorkflow(workflowDto: WorkflowCreateDto): Promise<WorkflowResponseDto> {
    try {
      this.logger.log(`Forwarding createWorkflow request to workflow service: ${JSON.stringify(workflowDto)}`);
      
      const response = await lastValueFrom(
        this.httpService.post<WorkflowResponseDto>(
          `${this.workflowServiceUrl}/api/v1/workflows`,
          workflowDto
        )
      );
      
      return response.data;
    } catch (error) {
      this.handleError('Error while creating workflow', error);
    }
  }

  /**
   * Forward request to get a workflow by ID
   * @param id The workflow ID
   */
  async getWorkflow(id: string): Promise<WorkflowResponseDto> {
    try {
      this.logger.log(`Forwarding getWorkflow request to workflow service for ID: ${id}`);
      
      const response = await lastValueFrom(
        this.httpService.get<WorkflowResponseDto>(
          `${this.workflowServiceUrl}/api/v1/workflows/${id}`
        )
      );
      
      return response.data;
    } catch (error) {
      this.handleError(`Error while getting workflow with ID ${id}`, error);
    }
  }

  /**
   * Get health status of all services
   */
  async getHealthStatus(): Promise<Record<string, any>> {
    try {
      this.logger.log('Checking health status of all services');
      
      const workflowHealth = await lastValueFrom(
        this.httpService.get<any>(`${this.workflowServiceUrl}/api/v1/health`)
      );
      
      return {
        gateway: {
          status: 'ok',
          timestamp: new Date().toISOString(),
          uptime: process.uptime()
        },
        workflow: workflowHealth.data
      };
    } catch (error) {
      // Still return gateway status even if other services are down
      return {
        gateway: {
          status: 'ok',
          timestamp: new Date().toISOString(),
          uptime: process.uptime()
        },
        workflow: {
          status: 'error',
          error: error.message
        }
      };
    }
  }

  /**
   * Handle HTTP errors from downstream services
   */
  private handleError(message: string, error: any): never {
    this.logger.error(`${message}: ${error.message}`, error.stack);
    
    if (error.response) {
      // If the error has a response from the downstream service, preserve the status and message
      throw new HttpException(
        error.response.data || { message: error.message },
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    
    // For other errors (like connection errors)
    throw new HttpException(
      { message: `Service communication error: ${error.message}` },
      HttpStatus.BAD_GATEWAY
    );
  }
} 