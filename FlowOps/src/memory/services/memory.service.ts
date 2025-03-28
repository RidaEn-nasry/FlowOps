import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { DatabaseDefinitionCreateDto, DatabaseDefinitionResponseDto } from '../../shared/dto/database-definition.dto';
import { DatabaseException, DatabaseDefinitionNotFoundException } from '../../common/exceptions/application.exception';
import { Column, DatabaseDefinition, SelectOption } from '../schemas/database-definition.schema';

/**
 * Service for memory operations including database definitions
 */
@Injectable()
export class MemoryService {
  private readonly logger = new Logger(MemoryService.name);

  constructor(
    private readonly prisma: PrismaService
  ) {}

  /**
   * Create a new database definition
   * @param databaseDefinitionDto Database definition creation data
   */
  async createDatabaseDefinition(databaseDefinitionDto: DatabaseDefinitionCreateDto): Promise<DatabaseDefinitionResponseDto> {
    try {
      // Create database definition in the database using Prisma
      const columns = databaseDefinitionDto.columns?.map(column => ({
        name: column.name,
        type: column.type,
        required: column.required || false,
        description: column.description,
        options: {
          create: column.options?.map(option => ({
            label: option.label,
            color: option.color
          })) || []
        }
      })) || [];

      const createdDatabaseDefinition = await this.prisma.databaseDefinition.create({
        data: {
          name: databaseDefinitionDto.name,
          workflowId: databaseDefinitionDto.workflowId,
          columns: {
            create: columns
          }
        },
        include: {
          columns: {
            include: {
              options: true
            }
          }
        }
      });

      // Return transformed response
      return this.mapToDatabaseDefinitionResponseDto(createdDatabaseDefinition);
    } catch (error) {
      this.logger.error(`Error creating database definition: ${error.message}`, error.stack);
      throw new DatabaseException(`Failed to create database definition: ${error.message}`);
    }
  }

  /**
   * Get a database definition by ID
   * @param id Database definition ID
   */
  async getDatabaseDefinition(id: string): Promise<DatabaseDefinitionResponseDto> {
    try {
      const databaseDefinition = await this.prisma.databaseDefinition.findUnique({
        where: { id },
        include: {
          columns: {
            include: {
              options: true
            }
          }
        }
      });

      if (!databaseDefinition) {
        throw new DatabaseDefinitionNotFoundException(id);
      }

      return this.mapToDatabaseDefinitionResponseDto(databaseDefinition);
    } catch (error) {
      if (error instanceof DatabaseDefinitionNotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to get database definition: ${error.message}`, error.stack);
      throw new DatabaseException(`Prisma error: ${error.message}`);
    }
  }

  /**
   * Get database definitions by workflow ID
   * @param workflowId Workflow ID
   */
  async getDatabaseDefinitionsByWorkflowId(workflowId: string): Promise<DatabaseDefinitionResponseDto[]> {
    try {
      const databaseDefinitions = await this.prisma.databaseDefinition.findMany({
        where: { workflowId },
        include: {
          columns: {
            include: {
              options: true
            }
          }
        }
      });
      return databaseDefinitions.map((def: any) => this.mapToDatabaseDefinitionResponseDto(def));
    } catch (error) {
      this.logger.error(`Failed to get database definitions by workflow ID: ${error.message}`, error.stack);
      throw new DatabaseException(`Prisma error: ${error.message}`);
    }
  }

  /**
   * Map Prisma database definition model to DatabaseDefinitionResponseDto
   */
  private mapToDatabaseDefinitionResponseDto(dbDef: any): DatabaseDefinitionResponseDto {
    return {
      id: dbDef.id,
      name: dbDef.name,
      workflowId: dbDef.workflowId,
      columns: dbDef.columns?.map((column: any) => ({
        id: column.id,
        name: column.name,
        type: column.type,
        required: column.required,
        description: column.description,
        options: column.options?.map((option: any) => ({
          id: option.id,
          label: option.label,
          color: option.color
        }))
      })),
      createdAt: dbDef.createdAt.toISOString(),
      updatedAt: dbDef.updatedAt.toISOString()
    };
  }
} 