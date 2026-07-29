import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

import { mapGrpcErrorToHttp } from './grpc-error.mapper';

@Injectable()
export class GrpcToHttpInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next
      .handle()
      .pipe(
        catchError((error: unknown) =>
          throwError(() => mapGrpcErrorToHttp(error)),
        ),
      );
  }
}
