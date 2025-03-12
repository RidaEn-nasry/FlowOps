import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { GatewayService } from './gateway.service';
import { of } from 'rxjs';
import { WorkflowCreateDto } from '../../shared/dto/workflow.dto';
import { AxiosResponse } from 'axios';

describe('GatewayService', () => {
  let service: GatewayService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GatewayService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn()
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'services.workflow.url') {
                return 'http://localhost:3001';
              }
              return null;
            })
          }
        }
      ],
    }).compile();

    service = module.get<GatewayService>(GatewayService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createWorkflow', () => {
    it('should forward the request to the workflow service', async () => {
      const workflowDto: WorkflowCreateDto = {
        name: 'Test Workflow',
        script: 'console.log("Hello World")'
      };

      const mockResponse: AxiosResponse = {
        data: {
          id: 'test-id',
          name: 'Test Workflow',
          script: 'console.log("Hello World")',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: 'http://localhost:3001/api/v1/workflows' } as any
      };

      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

      const result = await service.createWorkflow(workflowDto);
      expect(result).toEqual(mockResponse.data);
      expect(httpService.post).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/workflows',
        workflowDto
      );
    });
  });

  describe('getWorkflow', () => {
    it('should forward the request to the workflow service', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          id: 'test-id',
          name: 'Test Workflow',
          script: 'console.log("Hello World")',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: 'http://localhost:3001/api/v1/workflows/test-id' } as any
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getWorkflow('test-id');
      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/workflows/test-id'
      );
    });
  });

  describe('getHealthStatus', () => {
    it('should check health of all services', async () => {
      const mockWorkflowHealth: AxiosResponse = {
        data: {
          status: 'ok',
          timestamp: new Date().toISOString(),
          service: 'workflow-service',
          uptime: 123.456
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: 'http://localhost:3001/api/v1/health' } as any
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockWorkflowHealth));

      const result = await service.getHealthStatus();
      expect(result).toHaveProperty('gateway');
      expect(result).toHaveProperty('workflow');
      expect(result.gateway).toHaveProperty('status', 'ok');
      expect(result.workflow).toEqual(mockWorkflowHealth.data);
      expect(httpService.get).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/health'
      );
    });
  });
}); 