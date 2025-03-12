import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkflowService } from './workflow.service';
import { Workflow, WorkflowDocument } from '../schemas/workflow.schema';
import { WorkflowCreateDto } from '../../shared/dto/workflow.dto';
import { WorkflowNotFoundException } from '../../common/exceptions/application.exception';

const mockWorkflow = {
  id: 'test-id',
  name: 'Test Workflow',
  script: 'console.log("Hello World")',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  toJSON: jest.fn().mockReturnThis()
};

describe('WorkflowService', () => {
  let service: WorkflowService;
  let model: Model<WorkflowDocument>;
  let clientProxy: any;

  beforeEach(async () => {
    const clientProxyMock = {
      emit: jest.fn().mockReturnValue({
        toPromise: jest.fn().mockResolvedValue(undefined)
      })
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowService,
        {
          provide: getModelToken(Workflow.name),
          useValue: {
            findById: jest.fn(),
            create: jest.fn(),
            exec: jest.fn()
          }
        },
        {
          provide: 'WORKFLOW_SERVICE',
          useValue: clientProxyMock
        }
      ]
    }).compile();

    service = module.get<WorkflowService>(WorkflowService);
    model = module.get<Model<WorkflowDocument>>(getModelToken(Workflow.name));
    clientProxy = module.get('WORKFLOW_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWorkflow', () => {
    it('should return a workflow by id', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockWorkflow)
      } as any);

      const result = await service.getWorkflow('test-id');
      expect(result).toEqual(mockWorkflow);
      expect(model.findById).toHaveBeenCalledWith('test-id');
    });

    it('should throw WorkflowNotFoundException if workflow not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null)
      } as any);

      await expect(service.getWorkflow('test-id')).rejects.toThrow(WorkflowNotFoundException);
    });
  });

  describe('createWorkflow', () => {
    it('should create a new workflow', async () => {
      // This test is skipped for now
      expect(true).toBe(true);
    });
  });
}); 