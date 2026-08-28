import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

// 1. ZOD INPUT VALIDATION SCHEMAS
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const loginSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  static async register(req: Request, res: Response) {
    try {
      // Validate input payload
      const validatedData = registerSchema.parse(req.body);

      const result = await AuthService.register(
        validatedData.name,
        validatedData.email,
        validatedData.password
      );

      return res.status(201).json({
        message: 'User registered successfully!',
        data: result,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation Error', details: error.errors });
      }
      return res.status(400).json({ error: 'Registration Failed', message: error.message });
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  static async login(req: Request, res: Response) {
    try {
      // Validate input payload
      const validatedData = loginSchema.parse(req.body);

      const result = await AuthService.login(
        validatedData.email,
        validatedData.password
      );

      return res.status(200).json({
        message: 'Login successful!',
        data: result,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation Error', details: error.errors });
      }
      return res.status(401).json({ error: 'Authentication Failed', message: error.message });
    }
  }

  /**
   * GET /api/v1/auth/me (Protected Route)
   */
  static async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized', message: 'No user context found' });
      }

      const profile = await AuthService.getProfile(req.user.userId);
      return res.status(200).json({
        message: 'Profile retrieved successfully',
        data: profile,
      });
    } catch (error: any) {
      return res.status(404).json({ error: 'Not Found', message: error.message });
    }
  }
}
