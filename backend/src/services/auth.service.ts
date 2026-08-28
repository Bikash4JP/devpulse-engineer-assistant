import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// In-Memory User Store (Ensures instant usability during local dev setup)
interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

const usersDb: Map<string, StoredUser> = new Map();

export class AuthService {
  /**
   * Register a new user securely
   */
  static async register(name: string, email: string, password: string) {
    const existing = Array.from(usersDb.values()).find((u) => u.email === email);
    if (existing) {
      throw new Error('Email is already registered!');
    }

    // 1. Hash password with bcrypt meat grinder
    const passwordHash = await hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newUser: StoredUser = {
      id: userId,
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    usersDb.set(userId, newUser);

    // 2. Issue JWT VIP Wristband
    const token = generateToken({ userId: newUser.id, email: newUser.email });

    const userPayload: UserDTO = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    return { user: userPayload, token };
  }

  /**
   * Login existing user with password verification
   */
  static async login(email: string, password: string) {
    const user = Array.from(usersDb.values()).find((u) => u.email === email);
    if (!user) {
      throw new Error('Invalid email or password credentials');
    }

    // Compare typed password against ground beef hash
    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password credentials');
    }

    // Issue new JWT Token
    const token = generateToken({ userId: user.id, email: user.email });

    const userPayload: UserDTO = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    return { user: userPayload, token };
  }

  /**
   * Get user profile by ID
   */
  static async getProfile(userId: string): Promise<UserDTO> {
    const user = usersDb.get(userId);
    if (!user) {
      throw new Error('User profile not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
