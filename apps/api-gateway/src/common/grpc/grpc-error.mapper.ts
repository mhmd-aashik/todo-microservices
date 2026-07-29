import { status } from '@grpc/grpc-js';
import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

import type { GrpcError } from './grpc-error.interface';

export function mapGrpcErrorToHttp(error: unknown): HttpException {
  /*
   * Do not translate errors that are already valid HTTP exceptions.
   *
   * Example:
   * BadRequestException thrown inside the Gateway.
   */
  if (error instanceof HttpException) {
    return error;
  }

  const grpcError = toGrpcError(error);
  const message = getGrpcErrorMessage(grpcError);

  switch (grpcError.code) {
    case status.INVALID_ARGUMENT:
      return new BadRequestException(message);

    case status.NOT_FOUND:
      return new NotFoundException(message);

    case status.ALREADY_EXISTS:
      return new ConflictException(message);

    case status.UNAUTHENTICATED:
      return new UnauthorizedException(message);

    case status.PERMISSION_DENIED:
      return new ForbiddenException(message);

    case status.RESOURCE_EXHAUSTED:
      return new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);

    case status.FAILED_PRECONDITION:
      return new HttpException(message, HttpStatus.PRECONDITION_FAILED);

    case status.ABORTED:
      return new ConflictException(message);

    case status.OUT_OF_RANGE:
      return new BadRequestException(message);

    case status.UNIMPLEMENTED:
      return new HttpException(message, HttpStatus.NOT_IMPLEMENTED);

    case status.UNAVAILABLE:
      return new ServiceUnavailableException(
        'Todo Service is currently unavailable',
      );

    case status.DEADLINE_EXCEEDED:
      return new GatewayTimeoutException('Todo Service request timed out');

    case status.CANCELLED:
      return new HttpException(
        'Request was cancelled',
        HttpStatus.REQUEST_TIMEOUT,
      );

    case status.INTERNAL:
    case status.UNKNOWN:
    case status.DATA_LOSS:
      return new InternalServerErrorException(
        'An internal service error occurred',
      );

    default:
      return new BadGatewayException('An upstream service error occurred');
  }
}

function toGrpcError(error: unknown): GrpcError {
  if (isGrpcError(error)) {
    return error;
  }

  return {
    message: error instanceof Error ? error.message : 'Unknown service error',
  };
}

function isGrpcError(error: unknown): error is GrpcError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('code' in error || 'details' in error || 'message' in error)
  );
}

function getGrpcErrorMessage(error: GrpcError): string {
  if (typeof error.details === 'string' && error.details.trim().length > 0) {
    return error.details;
  }

  if (typeof error.message === 'string' && error.message.trim().length > 0) {
    return cleanGrpcMessage(error.message);
  }

  return 'Service request failed';
}

function cleanGrpcMessage(message: string): string {
  /*
   * Converts:
   *
   * "5 NOT_FOUND: Todo not found"
   *
   * into:
   *
   * "Todo not found"
   */
  return message.replace(/^\d+\s+[A-Z_]+:\s*/, '');
}
