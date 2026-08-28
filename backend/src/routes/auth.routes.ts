import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public Routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected Route (Requires JWT Bearer Token)
router.get('/me', authenticateToken, AuthController.getMe);

export default router;
