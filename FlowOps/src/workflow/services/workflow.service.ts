import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { WorkflowCreateDto, WorkflowResponseDto } from '../../shared/dto/workflow.dto';
import { IWorkflowService } from '../interfaces/workflow.interface';
import { WorkflowPrismaService } from '../../shared/prisma/workflow-prisma.service';
import { 
  DatabaseException, 
  WorkflowNotFoundException,
  EventPublishException
} from '../../common/exceptions/application.exception';

/**
 * Service for workflow operations
 */
@Injectable()
export class WorkflowService implements IWorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(
    private readonly prisma: WorkflowPrismaService,
    @Inject('WORKFLOW_SERVICE') private readonly clientProxy: ClientProxy
  ) {}

  /**
   * Create a new workflow
   * @param workflowDto Workflow creation data
   */
  async createWorkflow(workflowDto: WorkflowCreateDto): Promise<WorkflowResponseDto> {
    try {
      // Create new workflow in the database using Prisma
      const databaseColumns = workflowDto.databaseColumns?.map(column => ({
        name: column.name,
        type: column.type,
        required: column.required || false,
        description: column.description,
        options: {
          create: column.options?.map(option => ({
            label: option.label,
            color: option.color
          })) || []
        }
      })) || [];

      const createdWorkflow = await this.prisma.workflow.create({
        data: {
          name: workflowDto.name,
          script: workflowDto.script,
          databaseColumns: {
            create: databaseColumns
          }
        },
        include: {
          databaseColumns: {
            include: {
              options: true
            }
          }
        }
      });

      const workflowResponse = this.mapToWorkflowResponseDto(createdWorkflow);

      // Publish workflow creation event
      try {
        await this.clientProxy.emit('workflow.created', workflowResponse).toPromise();
        this.logger.log(`Published workflow.created event for workflow ID: ${workflowResponse.id}`);
      } catch (error) {
        this.logger.error(`Failed to publish workflow.created event: ${error.message}`, error.stack);
        throw new EventPublishException(`RabbitMQ publish error: ${error.message}`);
      }

      return workflowResponse;
    } catch (error) {
      if (error instanceof EventPublishException) {
        throw error;
      }
      this.logger.error(`Failed to create workflow: ${error.message}`, error.stack);
      throw new DatabaseException(`Prisma error: ${error.message}`);
    }
  }

  /**
   * Get a workflow by ID
   * @param id Workflow ID
   */
  async getWorkflow(id: string): Promise<WorkflowResponseDto> {
    try {
      const workflow = await this.prisma.workflow.findUnique({
        where: { id },
        include: {
          databaseColumns: {
            include: {
              options: true
            }
          }
        }
      });

      if (!workflow) {
        throw new WorkflowNotFoundException(id);
      }

      return this.mapToWorkflowResponseDto(workflow);
    } catch (error) {
      if (error instanceof WorkflowNotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to get workflow: ${error.message}`, error.stack);
      throw new DatabaseException(`Prisma error: ${error.message}`);
    }
  }

  /**
   * Get all workflows
   */
  async getAllWorkflows(): Promise<WorkflowResponseDto[]> {
    try {
      const workflows = await this.prisma.workflow.findMany({
        include: {
          databaseColumns: {
            include: {
              options: true
            }
          }
        }
      });
      return workflows.map(workflow => this.mapToWorkflowResponseDto(workflow));
    } catch (error) {
      this.logger.error(`Failed to get all workflows: ${error.message}`, error.stack);
      throw new DatabaseException(`Prisma error: ${error.message}`);
    }
  }

  /**
   * Map Prisma workflow model to WorkflowResponseDto
   */
  private mapToWorkflowResponseDto(workflow: any): WorkflowResponseDto {
    return {
      id: workflow.id,
      name: workflow.name,
      script: workflow.script,
      databaseColumns: workflow.databaseColumns?.map(column => ({
        id: column.id,
        name: column.name,
        type: column.type,
        required: column.required,
        description: column.description,
        options: column.options?.map(option => ({
          id: option.id,
          label: option.label,
          color: option.color
        }))
      })),
      createdAt: workflow.createdAt.toISOString(),
      updatedAt: workflow.updatedAt.toISOString()
    };
  }
} 