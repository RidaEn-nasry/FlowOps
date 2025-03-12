import { IsNotEmpty, IsOptional, IsString, IsArray, IsBoolean, IsEnum, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Enum for column types
 */
export enum ColumnType {
  TEXT = 'text',
  LONG_TEXT = 'long_text',
  NUMBER = 'number',
  DATE = 'date',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  BOOLEAN = 'boolean',
  URL = 'url',
  FILE = 'file'
}

/**
 * DTO for select options
 */
export class SelectOptionDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  color?: string;
}

/**
 * DTO for column definition
 */
export class ColumnDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(ColumnType)
  type: ColumnType;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectOptionDto)
  options?: SelectOptionDto[];

  @IsOptional()
  @IsString()
  description?: string;
}

/**
 * DTO for creating a database definition
 */
export class DatabaseDefinitionCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  workflowId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColumnDto)
  columns: ColumnDto[];
}

/**
 * DTO for database definition response
 */
export class DatabaseDefinitionResponseDto extends DatabaseDefinitionCreateDto {
  @IsString()
  id: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
} 