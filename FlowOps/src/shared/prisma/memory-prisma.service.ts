import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../node_modules/@prisma/memory-client';

@Injectable()
export class MemoryPrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
} 