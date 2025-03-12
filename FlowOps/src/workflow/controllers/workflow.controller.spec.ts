import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from '../services/workflow.service';
import { WorkflowCreateDto, WorkflowResponseDto } from '../../shared/dto/workflow.dto';

describe('WorkflowController', () => {
  let controller: WorkflowController;
  let service: WorkflowService;

  beforeEach(async () => {
    const mockWorkflowService = {
      createWorkflow: jest.fn(),
      getWorkflow: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowController],
      providers: [
        {
          provide: WorkflowService,
          useValue: mockWorkflowService
        }
      ]
    }).compile();

    controller = module.get<WorkflowController>(WorkflowController);
    service = module.get<WorkflowService>(WorkflowService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createWorkflow', () => {
    it('should create a workflow', async () => {
      const createWorkflowDto: WorkflowCreateDto = {
        name: 'Test Workflow',
        script: 'console.log("Hello World")'
      };

      const expectedResponse: WorkflowResponseDto = {
        id: 'test-id',
        name: 'Test Workflow',
        script: 'console.log("Hello World")',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      jest.spyOn(service, 'createWorkflow').mockResolvedValue(expectedResponse);

      const result = await controller.createWorkflow(createWorkflowDto);
      expect(result).toEqual(expectedResponse);
      expect(service.createWorkflow).toHaveBeenCalledWith(createWorkflowDto);
    });
  });

  describe('getWorkflow', () => {
    it('should return a workflow by id', async () => {
      const expectedResponse: WorkflowResponseDto = {
        id: 'test-id',
        name: 'Test Workflow',
        script: 'console.log("Hello World")',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      jest.spyOn(service, 'getWorkflow').mockResolvedValue(expectedResponse);

      const result = await controller.getWorkflow('test-id');
      expect(result).toEqual(expectedResponse);
      expect(service.getWorkflow).toHaveBeenCalledWith('test-id');
    });
  });
}); 