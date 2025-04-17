import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { tasks } from './task.model';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { TaskStatus, TaskPriority } from './task.enums';

// Mock the db module
jest.mock('../db', () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    limit: jest.fn(),
  },
}));

describe('TaskService', () => {
  let service: TaskService;

  // Sample data for tests
  const mockTask = {
    id: 1,
    name: 'Test Task',
    dueDate: new Date(),
    status: TaskStatus.Pending,
    priority: TaskPriority.Red,
    dateCreated: new Date(),
    isActive: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService],
    }).compile();

    service = module.get<TaskService>(TaskService);
    jest.clearAllMocks();

    // Default return values for db operations
    ((db as any).returning as jest.Mock).mockResolvedValue([mockTask]);
    ((db as any).limit as jest.Mock).mockResolvedValue([mockTask]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task and return it', async () => {
      const createTaskDto = {
        name: 'Test Task',
        dueDate: new Date(),
        status: TaskStatus.Pending,
        priority: TaskPriority.Red,
      };

      const result = await service.createTask(createTaskDto);

      expect((db as any).insert).toHaveBeenCalledWith(tasks);
      expect((db as any).values).toHaveBeenCalledWith(createTaskDto);
      expect((db as any).returning).toHaveBeenCalled();
      expect(result).toEqual([mockTask]);
    });
  });

  describe('updateTask', () => {
    it('should update a task and return it', async () => {
      const id = 1;
      const updateTaskDto = {
        name: 'Updated Task',
        status: TaskStatus.InProgress,
      };

      const result = await service.updateTask(id, updateTaskDto);

      expect((db as any).update).toHaveBeenCalledWith(tasks);
      expect((db as any).set).toHaveBeenCalledWith(updateTaskDto);
      expect((db as any).where).toHaveBeenCalledWith(eq(tasks.id, id));
      expect((db as any).returning).toHaveBeenCalled();
      expect(result).toEqual([mockTask]);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const id = 1;

      await service.deleteTask(id);

      expect((db as any).delete).toHaveBeenCalledWith(tasks);
      expect((db as any).where).toHaveBeenCalledWith(eq(tasks.id, id));
    });
  });

  describe('getAllTasks', () => {
    it('should get all tasks with pagination', async () => {
      const page = 2;
      const limit = 10;
      const filter = {};

      const result = await service.getAllTasks(filter, page, limit);

      expect((db as any).select).toHaveBeenCalled();
      expect((db as any).from).toHaveBeenCalledWith(tasks);
      expect((db as any).offset).toHaveBeenCalledWith((page - 1) * limit);
      expect((db as any).limit).toHaveBeenCalledWith(limit);
      expect(result).toEqual([mockTask]);
    });

    it('should apply status filter if provided', async () => {
      const filter = { status: TaskStatus.Pending };

      await service.getAllTasks(filter);

      expect((db as any).where).toHaveBeenCalled();
    });

    it('should apply priority filter if provided', async () => {
      const filter = { priority: TaskPriority.Red };

      await service.getAllTasks(filter);

      expect((db as any).where).toHaveBeenCalled();
    });

    it('should apply multiple filters if provided', async () => {
      const filter = {
        status: TaskStatus.Pending,
        priority: TaskPriority.Red,
      };

      await service.getAllTasks(filter);

      expect((db as any).where).toHaveBeenCalled();
    });
  });

  describe('countTasks', () => {
    it('should count tasks with filters', async () => {
      const filter = {
        status: TaskStatus.Pending,
        priority: TaskPriority.Red,
      };

      await service.countTasks(filter);

      expect((db as any).select).toHaveBeenCalled();
      expect((db as any).from).toHaveBeenCalledWith(tasks);
    });
  });
});
