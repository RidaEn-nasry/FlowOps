import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MemoryService } from './services/memory.service';
import { MemoryController } from './controllers/memory.controller';
import { PrismaModule } from '../shared/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule
  ],
  controllers: [MemoryController],
  providers: [MemoryService],
  exports: [MemoryService]
})
export class MemoryModule {} 