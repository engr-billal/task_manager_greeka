import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Use DATABASE_URL from environment variables (Heroku will set this automatically)
const databaseUrl = process.env.DATABASE_URL;

// Check if DATABASE_URL is provided (use for local dev or fallback)
export const pool = new Pool({
  connectionString:
    databaseUrl ||
    'postgres://postgres:Muhammad3913@@localhost:5432/task_manager',
  ssl: databaseUrl ? { rejectUnauthorized: false } : false, // SSL for Heroku connections
});

// Create the Drizzle instance using the PostgreSQL connection pool
export const db = drizzle(pool, { schema });
