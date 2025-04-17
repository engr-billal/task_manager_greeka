import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from '../db';

// Run migrations
async function runMigrations() {
  console.log('Running migrations...');
  console.log('Database URL:', process.env.DATABASE_URL || 'Not set');

  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the pool after migrations
    await pool.end();
  }
}

runMigrations();
