import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { up as createTasksTable } from './0000_create_tasks_table';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'task_manager',
  password: 'Muhammad3913@',
  port: 5432,
});

const db = drizzle(pool);

async function runMigrations() {
  try {
    console.log('Running migrations...');
    await createTasksTable(db);
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigrations();
