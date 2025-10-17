import 'dotenv/config';
import { z } from 'zod';

type Environment = z.infer<typeof environmentSchema>;

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  SERVER_URL: z.string().url().optional(),
  WEB_URL: z.string().url().optional()
});

const parsedEnvironment = environmentSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  SERVER_URL: process.env.SERVER_URL,
  WEB_URL: process.env.WEB_URL
});

if (!parsedEnvironment.success) {
  console.error('Invalid environment configuration', parsedEnvironment.error.flatten().fieldErrors);
  throw new Error('Failed to parse environment variables');
}

export const env: Environment = parsedEnvironment.data;
