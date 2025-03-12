import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { MemoryService } from '../services/memory.service';
import { DatabaseDefinitionCreateDto, DatabaseDefinitionResponseDto } from '../../shared/dto/database-definition.dto';

/**
 * Controller for memory operations including database definitions
 */
@Controller('api/v1/memory')
export class MemoryController {
  private readonly logger = new Logger(MemoryController.name);

  constructor(private readonly memoryService: MemoryService) {}

  /**
   * Create a new database definition
   * @param createDatabaseDefinitionDto Database definition creation data
   */
  @Post('databases')
  async createDatabaseDefinition(
    @Body() createDatabaseDefinitionDto: DatabaseDefinitionCreateDto
  ): Promise<DatabaseDefinitionResponseDto> {
    this.logger.log(`Creating database definition: ${JSON.stringify(createDatabaseDefinitionDto)}`);
    return this.memoryService.createDatabaseDefinition(createDatabaseDefinitionDto);
  }

  /**
   * Get a database definition by ID
   * @param id Database definition ID
   */
  @Get('databases/:id')
  async getDatabaseDefinition(@Param('id') id: string): Promise<DatabaseDefinitionResponseDto> {
    this.logger.log(`Getting database definition with ID: ${id}`);
    return this.memoryService.getDatabaseDefinition(id);
  }

  /**
   * Get database definitions by workflow ID
   * @param workflowId Workflow ID
   */
  @Get('workflows/:workflowId/databases')
  async getDatabaseDefinitionsByWorkflowId(
    @Param('workflowId') workflowId: string
  ): Promise<DatabaseDefinitionResponseDto[]> {
    this.logger.log(`Getting database definitions for workflow ID: ${workflowId}`);
    return this.memoryService.getDatabaseDefinitionsByWorkflowId(workflowId);
  }
} 