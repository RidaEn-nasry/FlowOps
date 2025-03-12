import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global HTTP exception filter
 * Handles all exceptions in a consistent way across the application
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || null,
      details: status !== HttpStatus.INTERNAL_SERVER_ERROR 
        ? exception.getResponse()
        : 'Internal server error'
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
        HttpExceptionFilter.name
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} - Status ${status}`,
        JSON.stringify(errorResponse),
        HttpExceptionFilter.name
      );
    }

    response.status(status).json(errorResponse);
  }
} 