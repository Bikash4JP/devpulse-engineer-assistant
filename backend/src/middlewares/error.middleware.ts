import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

/**
 * Centralized Production Error Handler Middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[${new Date().toISOString()}] 💥 ERROR ON ${req.method} ${req.originalUrl}:`, err);

  return res.status(statusCode).json({
    status: 'error',
    statusCode,
    error: isAppError ? err.constructor.name : 'InternalServerError',
    message: process.env.NODE_ENV === 'development' || isAppError ? message : 'Something went wrong on the server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
