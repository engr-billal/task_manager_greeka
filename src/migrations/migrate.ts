import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from '../db';
import * as fs from 'fs';
import * as path from 'path';

// Run migrations
async function runMigrations() {
  console.log('Running migrations...');
  console.log('Database URL:', process.env.DATABASE_URL || 'Not set');

  // Ensure migrations directories exist
  const migrationsFolder = 'drizzle';
  const metaFolder = path.join(migrationsFolder, 'meta');
  const journalFile = path.join(metaFolder, '_journal.json');

  try {
    // Create folders if they don't exist
    if (!fs.existsSync(migrationsFolder)) {
      fs.mkdirSync(migrationsFolder);
    }
    if (!fs.existsSync(metaFolder)) {
      fs.mkdirSync(metaFolder);
    }

    // Create default journal if it doesn't exist
    if (!fs.existsSync(journalFile)) {
      const defaultJournal = {
        version: '5',
        dialect: 'pg',
        entries: [
          {
            idx: 0,
            version: '5',
            when: Date.now().toString(),
            tag: '0000_create_tasks_table',
            breakpoints: true,
          },
        ],
      };
      fs.writeFileSync(journalFile, JSON.stringify(defaultJournal, null, 2));
    }

    // Run migrations
    await migrate(db, { migrationsFolder });
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
