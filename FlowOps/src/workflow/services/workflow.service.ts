import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { WorkflowCreateDto, WorkflowResponseDto } from '../../shared/dto/workflow.dto';
import { IWorkflowService } from '../interfaces/workflow.interface';
import { Workflow, WorkflowDocument } from '../schemas/workflow.schema';
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
    @InjectModel(Workflow.name) private workflowModel: Model<WorkflowDocument>,
    @Inject('WORKFLOW_SERVICE') private readonly clientProxy: ClientProxy
  ) {}

  /**
   * Create a new workflow
   * @param workflowDto Workflow creation data
   */
  async createWorkflow(workflowDto: WorkflowCreateDto): Promise<WorkflowResponseDto> {
    try {
      // Create new workflow in the database
      const createdWorkflow = new this.workflowModel(workflowDto);
      const savedWorkflow = await createdWorkflow.save();

      const workflowResponse = savedWorkflow.toJSON() as WorkflowResponseDto;

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
      throw new DatabaseException(`MongoDB error: ${error.message}`);
    }
  }

  /**
   * Get a workflow by ID
   * @param id Workflow ID
   */
  async getWorkflow(id: string): Promise<WorkflowResponseDto> {
    try {
      const workflow = await this.workflowModel.findById(id).exec();

      if (!workflow) {
        throw new WorkflowNotFoundException(id);
      }

      return workflow.toJSON() as WorkflowResponseDto;
    } catch (error) {
      if (error instanceof WorkflowNotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to get workflow: ${error.message}`, error.stack);
      throw new DatabaseException(`MongoDB error: ${error.message}`);
    }
  }
} 