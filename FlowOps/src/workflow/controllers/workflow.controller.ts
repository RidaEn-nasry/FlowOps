import { Controller, Get, Post, Body, Param, HttpStatus, Logger } from '@nestjs/common';
import { WorkflowService } from '../services/workflow.service';
import { WorkflowCreateDto, WorkflowResponseDto } from '../../shared/dto/workflow.dto';

/**
 * Controller for workflow operations
 */
@Controller('api/v1/workflows')
export class WorkflowController {
  private readonly logger = new Logger(WorkflowController.name);

  constructor(private readonly workflowService: WorkflowService) {}

  /**
   * Create a new workflow
   * @param createWorkflowDto Workflow creation data
   */
  @Post()
  async createWorkflow(@Body() createWorkflowDto: WorkflowCreateDto): Promise<WorkflowResponseDto> {
    this.logger.log(`Creating workflow with name: ${createWorkflowDto.name}`);
    return this.workflowService.createWorkflow(createWorkflowDto);
  }

  /**
   * Get a workflow by ID
   * @param id Workflow ID
   */
  @Get(':id')
  async getWorkflow(@Param('id') id: string): Promise<WorkflowResponseDto> {
    this.logger.log(`Getting workflow with ID: ${id}`);
    return this.workflowService.getWorkflow(id);
  }

  /**
   * Get all workflows
   */
  @Get()
  async getAllWorkflows(): Promise<WorkflowResponseDto[]> {
    this.logger.log('Getting all workflows');
    return this.workflowService.getAllWorkflows();
  }
} 