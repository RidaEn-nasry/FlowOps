import { IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ColumnDto } from './database-definition.dto';

/**
 * Base DTO for workflow data
 */
export class WorkflowBaseDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  script: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColumnDto)
  databaseColumns?: ColumnDto[];
}

/**
 * DTO for creating a new workflow
 */
export class WorkflowCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  script: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColumnDto)
  databaseColumns?: ColumnDto[];
}

/**
 * DTO for workflow response
 */
export class WorkflowResponseDto extends WorkflowBaseDto {
  @IsString()
  id: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
} 