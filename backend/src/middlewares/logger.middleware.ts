import { Request, Response, NextFunction } from 'express';

/**
 * Structured HTTP Request & Response Logger Middleware
 * Logs HTTP Method, Request Path, Response Status, and Execution Time (ms)
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const logSymbol = statusCode >= 400 ? '⚠️' : '✅';
    console.log(
      `[${new Date().toISOString()}] ${logSymbol} ${method} ${originalUrl} | Status: ${statusCode} | Duration: ${duration}ms`
    );
  });

  next();
};
