import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Turns a raw password cow into a ground beef hash
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Grinds typed password and checks if it matches stored hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
