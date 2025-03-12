import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { TestModule } from './test.module';

describe('Gateway (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
    })
      .overrideProvider(HttpService)
      .useValue({
        post: jest.fn(),
        get: jest.fn()
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    }));
    
    httpService = moduleFixture.get<HttpService>(HttpService);
    
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/v1/health (GET)', () => {
    // Mock the health check response
    jest.spyOn(httpService, 'get').mockImplementation(() => {
      return of({
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
      });
    });

    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect((res: any) => {
        expect(res.body).toHaveProperty('gateway');
        expect(res.body).toHaveProperty('workflow');
        expect(res.body.gateway).toHaveProperty('status', 'ok');
        expect(res.body.workflow).toHaveProperty('status', 'ok');
      });
  });
}); 