import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MemoryService } from './services/memory.service';
import { MemoryController } from './controllers/memory.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MEMORY_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rabbitmq.uri') || ''],
            queue: configService.get<string>('rabbitmq.queues.memory') || '',
            queueOptions: {
              durable: true
            },
            exchange: configService.get<string>('rabbitmq.exchange') || '',
            noAck: false
          }
        })
      }
    ])
  ],
  controllers: [MemoryController],
  providers: [MemoryService],
  exports: [MemoryService]
})
export class MemoryModule {} 