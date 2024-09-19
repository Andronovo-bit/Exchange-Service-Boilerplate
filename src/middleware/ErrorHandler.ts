// src/middleware/ErrorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { NotFoundError, ValidationError, UnauthorizedError, ForbiddenError } from '../utils/errors';
import { error } from './ResponseHandler';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof NotFoundError) {
    error(res, 404, 'NOT_FOUND', err.message);
  } else if (err instanceof ValidationError) {
    error(res, 400, 'VALIDATION_ERROR', err.message);
  } else if (err instanceof UnauthorizedError) {
    error(res, 401, 'UNAUTHORIZED', err.message);
  } else if (err instanceof ForbiddenError) {
    error(res, 403, 'FORBIDDEN', err.message);
  } else {
    error(res, 500, 'SERVER_ERROR', 'Something broke! ' + err.message);
  }
}