import { TaskStatus, TaskPriority } from './task.enums';

export class CreateTaskDto {
  name: string;
  dueDate: Date;
  status: TaskStatus;
  priority: TaskPriority;
}

export class UpdateTaskDto {
  name?: string;
  dueDate?: Date;
  status?: TaskStatus;
  priority?: TaskPriority;
}
