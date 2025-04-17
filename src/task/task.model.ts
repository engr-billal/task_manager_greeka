import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { TaskStatus, TaskPriority } from './task.enums';

const statusEnum = pgEnum('status', [
  TaskStatus.Pending,
  TaskStatus.Done,
  TaskStatus.InProgress,
  TaskStatus.Paused,
]);
const priorityEnum = pgEnum('priority', [
  TaskPriority.Red,
  TaskPriority.Yellow,
  TaskPriority.Blue,
]);

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  dueDate: text('due_date').notNull(),
  status: statusEnum('status').notNull(),
  priority: priorityEnum('priority').notNull(),
  dateCreated: timestamp('date_created').defaultNow(),
  isActive: boolean('is_active').default(true),
});
