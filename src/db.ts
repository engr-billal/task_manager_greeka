import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Create a new pool for PostgreSQL
export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'task_manager',
  password: 'Muhammad3913@',
  port: 5432,
});

// Create the Drizzle instance using the PostgreSQL connection pool
export const db = drizzle(pool, { schema });
