import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';

const statusEnum = pgEnum('status', [
  'Pending',
  'Done',
  'InProgress',
  'Paused',
]);
const priorityEnum = pgEnum('priority', ['Red', 'Yellow', 'Blue']);

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  dueDate: text('due_date').notNull(),
  status: statusEnum('status').notNull(),
  priority: priorityEnum('priority').notNull(),
  dateCreated: timestamp('date_created').defaultNow(),
  isActive: boolean('is_active').default(true),
});
