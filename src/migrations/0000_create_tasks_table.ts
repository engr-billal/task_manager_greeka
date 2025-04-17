import { sql } from 'drizzle-orm';

export async function up(db: any) {
  // Create enums only if they do not exist
  await db.execute(sql`
    DO $$
    BEGIN
      -- Check if status_enum type exists, create it if not
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_enum') THEN
        CREATE TYPE status_enum AS ENUM ('Pending', 'Done', 'InProgress', 'Paused');
      END IF;
      
      -- Check if priority_enum type exists, create it if not
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority_enum') THEN
        CREATE TYPE priority_enum AS ENUM ('Red', 'Yellow', 'Blue');
      END IF;
    END
    $$;
  `);

  // Create tasks table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      due_date TIMESTAMP NOT NULL,
      status status_enum NOT NULL,
      priority priority_enum NOT NULL,
      date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT true
    );
  `);
}

export async function down(db: any) {
  // Drop tasks table and enums
  await db.execute(sql`
    DROP TABLE IF EXISTS tasks;
    DROP TYPE IF EXISTS status_enum;
    DROP TYPE IF EXISTS priority_enum;
  `);
}
