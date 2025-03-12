import { Module, Global } from '@nestjs/common';
import { WorkflowPrismaService } from './workflow-prisma.service';
import { MemoryPrismaService } from './memory-prisma.service';

@Global()
@Module({
  providers: [WorkflowPrismaService, MemoryPrismaService],
  exports: [WorkflowPrismaService, MemoryPrismaService],
})
export class PrismaModule {} 