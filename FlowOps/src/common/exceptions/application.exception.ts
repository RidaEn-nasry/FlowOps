import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base application exception
 */
export class ApplicationException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}

/**
 * Database operation exception
 */
export class DatabaseException extends ApplicationException {
  constructor(message: string) {
    super(`Database operation failed: ${message}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

/**
 * Workflow not found exception
 */
export class WorkflowNotFoundException extends ApplicationException {
  constructor(workflowId: string) {
    super(`Workflow with ID ${workflowId} not found`, HttpStatus.NOT_FOUND);
  }
}

/**
 * Workflow creation exception
 */
export class WorkflowCreationException extends ApplicationException {
  constructor(message: string) {
    super(`Failed to create workflow: ${message}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

/**
 * Event publish exception
 */
export class EventPublishException extends ApplicationException {
  constructor(message: string) {
    super(`Failed to publish event: ${message}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

/**
 * Database definition not found exception
 */
export class DatabaseDefinitionNotFoundException extends ApplicationException {
  constructor(databaseDefinitionId: string) {
    super(`Database definition with ID ${databaseDefinitionId} not found`, HttpStatus.NOT_FOUND);
  }
}

/**
 * Database definition creation exception
 */
export class DatabaseDefinitionCreationException extends ApplicationException {
  constructor(message: string) {
    super(`Failed to create database definition: ${message}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
} 