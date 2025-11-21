import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, path } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;
          this.logRequest(method, path, statusCode, duration);
        },
        error: (error: unknown) => {
          const duration = Date.now() - startTime;
          let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          if (error instanceof HttpException) {
            statusCode = error.getStatus();
          }
          this.logRequest(method, path, statusCode, duration);
        },
      }),
    );
  }

  private logRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
  ): void {
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] ${method} ${path} - ${statusCode} - ${duration}ms`,
    );
  }
}
