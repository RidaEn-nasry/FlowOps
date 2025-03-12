import { WorkflowCreateDto, WorkflowResponseDto } from '../../shared/dto/workflow.dto';

/**
 * Interface for gateway service operations
 */
export interface IGatewayService {
  /**
   * Forward request to create a new workflow
   * @param workflow The workflow to create
   */
  createWorkflow(workflow: WorkflowCreateDto): Promise<WorkflowResponseDto>;
  
  /**
   * Forward request to get a workflow by ID
   * @param id The workflow ID
   */
  getWorkflow(id: string): Promise<WorkflowResponseDto>;
  
  /**
   * Get health status of all services
   */
  getHealthStatus(): Promise<Record<string, any>>;
} 