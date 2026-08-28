import dotenv from 'dotenv';
import { z } from 'zod';

// Load variables from .env file into process.env
dotenv.config();

// Schema definition: What environment variables MUST exist and what type are they?
const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required for user security!'),
  AWS_ACCESS_KEY_ID: z.string().min(1, 'AWS_ACCESS_KEY_ID required'),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, 'AWS_SECRET_ACCESS_KEY required'),
  AWS_REGION: z.string().default('ap-southeast-2'),
  S3_BUCKET: z.string().default('devpulse-bikash'),
  DATABASE_URL: z.string().optional(),
});

// Validate process.env against our schema
const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('❌ FATAL: Invalid Environment Variables in .env file!');
  console.error(parseResult.error.format());
  process.exit(1); // Stop server immediately!
}

export const env = parseResult.data;
