import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { GatewayService } from '../services/gateway.service';
import { WorkflowCreateDto, WorkflowResponseDto } from '../../shared/dto/workflow.dto';

/**
 * Gateway controller for workflow operations
 * Acts as a facade to the underlying workflow service
 */
@Controller('api/v1/workflows')
export class WorkflowGatewayController {
  private readonly logger = new Logger(WorkflowGatewayController.name);

  constructor(private readonly gatewayService: GatewayService) {}

  /**
   * Create a new workflow
   * @param createWorkflowDto Workflow creation data
   */
  @Post()
  async createWorkflow(@Body() createWorkflowDto: WorkflowCreateDto): Promise<WorkflowResponseDto> {
    this.logger.log(`Gateway received createWorkflow request: ${JSON.stringify(createWorkflowDto)}`);
    return this.gatewayService.createWorkflow(createWorkflowDto);
  }

  /**
   * Get a workflow by ID
   * @param id Workflow ID
   */
  @Get(':id')
  async getWorkflow(@Param('id') id: string): Promise<WorkflowResponseDto> {
    this.logger.log(`Gateway received getWorkflow request for ID: ${id}`);
    return this.gatewayService.getWorkflow(id);
  }
} 