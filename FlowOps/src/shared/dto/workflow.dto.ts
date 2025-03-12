import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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