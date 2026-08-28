import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';

// Extend Express Request interface to include user payload
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * Auth Middleware Bouncer: Inspects JWT VIP Wristband
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access Token Missing. Please provide a valid Bearer token.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = payload; // Attach user context to request
    next(); // Pass to next handler
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or Expired Access Token. Please log in again.',
    });
  }
};
