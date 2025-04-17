import { Injectable } from '@nestjs/common';
import { tasks } from './task.model';
import { db } from '../db';
import { sql, eq, and } from 'drizzle-orm';

@Injectable()
export class TaskService {
  // Create Task
  async createTask(createTaskDto: any) {
    const { name, dueDate, status, priority } = createTaskDto;
    return db
      .insert(tasks)
      .values({ name, dueDate, status, priority })
      .returning();
  }

  // Update Task
  async updateTask(id: number, updateTaskDto: any) {
    const { status, priority, name, dueDate } = updateTaskDto;
    return db
      .update(tasks)
      .set({ status, priority, name, dueDate })
      .where(eq(tasks.id, id))
      .returning();
  }

  // Delete Task
  async deleteTask(id: number) {
    return db.delete(tasks).where(eq(tasks.id, id));
  }

  // Get One Task by ID
  async getTaskById(id: number) {
    return db.select().from(tasks).where(eq(tasks.id, id));
  }

  // Get all tasks with pagination and filtering
  async getAllTasks(filter: any, page: number = 1, limit: number = 10) {
    const conditions: any[] = [];

    if (filter.status) {
      conditions.push(eq(tasks.status, filter.status));
    }

    if (filter.priority) {
      conditions.push(eq(tasks.priority, filter.priority));
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    return db
      .select()
      .from(tasks)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .offset((pageNum - 1) * limitNum)
      .limit(limitNum);
  }

  // Count tasks for pagination
  async countTasks(filter: any) {
    const query = db.select().from(tasks);

    if (filter.status) {
      query.where(eq(tasks.status, filter.status));
    }

    if (filter.priority) {
      query.where(eq(tasks.priority, filter.priority));
    }

    return db.select({ count: sql<number>`count(*)` }).from(tasks);
  }
}
