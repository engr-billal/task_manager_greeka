import { sql } from 'drizzle-orm';

export async function up(db: any) {
  // Create enums first
  await db.execute(sql`
    CREATE TYPE status_enum AS ENUM ('Pending', 'Done', 'InProgress', 'Paused');
    CREATE TYPE priority_enum AS ENUM ('Red', 'Yellow', 'Blue');
  `);

  // Create tasks table
  await db.execute(sql`
    CREATE TABLE tasks (
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
  await db.execute(sql`
    DROP TABLE IF EXISTS tasks;
    DROP TYPE IF EXISTS status_enum;
    DROP TYPE IF EXISTS priority_enum;
  `);
}
