import { Injectable, Logger } from '@nestjs/common';
import { WorkflowCreateDto, WorkflowResponseDto } from '../../shared/dto/workflow.dto';
import { IWorkflowService } from '../interfaces/workflow.interface';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Column, SelectOption } from '../../memory/schemas/database-definition.schema';
import { 
  DatabaseException, 
  WorkflowNotFoundException
} from '../../common/exceptions/application.exception';
import { Workflow } from '../schemas/workflow.schema';

/**
 * Service for workflow operations
 */
@Injectable()
export class WorkflowService implements IWorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(
    private readonly prisma: PrismaService
  ) {}

  /**
   * Create a new workflow
   * @param workflowDto Workflow creation data
   */
  async createWorkflow(workflowDto: WorkflowCreateDto): Promise<WorkflowResponseDto> {
    try {
      // Create new workflow in the database using Prisma
      const createdWorkflow = await this.prisma.workflow.create({
        data: {
          name: workflowDto.name,
          script: workflowDto.script,
          // If there are databaseColumns, create database definitions instead
          databaseDefinitions: workflowDto.databaseColumns ? {
            create: [{
              name: `${workflowDto.name} Database`,
              columns: {
                create: workflowDto.databaseColumns.map(column => ({
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
                }))
              }
            }]
          } : undefined
        },
        include: {
          databaseDefinitions: {
            include: {
              columns: {
                include: {
                  options: true
                }
              }
            }
          }
        }
      });

      // Return transformed response
      return this.mapToWorkflowResponseDto(createdWorkflow);
    } catch (error) {
      this.logger.error(`Error creating workflow: ${error.message}`, error.stack);
      throw new DatabaseException(`Failed to create workflow: ${error.message}`);
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
          databaseDefinitions: {
            include: {
              columns: {
                include: {
                  options: true
                }
              }
            }
          }
        }
      });

      if (!workflow) {
        throw new WorkflowNotFoundException(`Workflow with ID ${id} not found`);
      }

      return this.mapToWorkflowResponseDto(workflow);
    } catch (error) {
      if (error instanceof WorkflowNotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching workflow: ${error.message}`, error.stack);
      throw new DatabaseException(`Failed to fetch workflow: ${error.message}`);
    }
  }

  /**
   * Get all workflows
   */
  async getAllWorkflows(): Promise<WorkflowResponseDto[]> {
    try {
      const workflows = await this.prisma.workflow.findMany({
        include: {
          databaseDefinitions: {
            include: {
              columns: {
                include: {
                  options: true
                }
              }
            }
          }
        }
      });

      return workflows.map((workflow: any) => this.mapToWorkflowResponseDto(workflow));
    } catch (error) {
      this.logger.error(`Error fetching all workflows: ${error.message}`, error.stack);
      throw new DatabaseException(`Failed to fetch workflows: ${error.message}`);
    }
  }

  /**
   * Map Prisma workflow model to DTO
   * @param workflow Workflow from database
   */
  private mapToWorkflowResponseDto(workflow: any): WorkflowResponseDto {
    // Extract database columns from the first database definition if it exists
    const databaseColumns = workflow.databaseDefinitions && workflow.databaseDefinitions.length > 0
      ? workflow.databaseDefinitions[0].columns.map((column: any) => ({
          name: column.name,
          type: column.type,
          required: column.required,
          description: column.description,
          options: column.options.map((option: any) => ({
            label: option.label,
            color: option.color
          }))
        }))
      : [];

    return {
      id: workflow.id,
      name: workflow.name,
      script: workflow.script,
      databaseColumns: databaseColumns,
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt
    };
  }
} 