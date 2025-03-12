import { WorkflowCreateDto, WorkflowResponseDto } from '../../shared/dto/workflow.dto';

/**
 * Interface for workflow service operations
 */
export interface IWorkflowService {
  /**
   * Create a new workflow
   * @param workflow The workflow to create
   */
  createWorkflow(workflow: WorkflowCreateDto): Promise<WorkflowResponseDto>;
  
  /**
   * Get a workflow by ID
   * @param id The workflow ID
   */
  getWorkflow(id: string): Promise<WorkflowResponseDto>;
} 