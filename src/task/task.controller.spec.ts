import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TaskStatus, TaskPriority } from './task.enums';

type Task = {
  id: number;
  name: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  dateCreated: Date;
  isActive: boolean;
};

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        name: 'New Task',
        status: TaskStatus.Pending,
        priority: TaskPriority.Red,
        dueDate: new Date(),
      };

      const mockCreatedTask: Task = {
        id: 1,
        ...createTaskDto,
        dueDate: createTaskDto.dueDate.toISOString(),
        dateCreated: new Date(),
        isActive: true,
      };

      jest.spyOn(service, 'createTask').mockResolvedValue([mockCreatedTask]);

      const result = await controller.createTask(createTaskDto);
      expect(result).toEqual([mockCreatedTask]);
      expect(service.createTask).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = {
        name: 'Updated Task',
        status: TaskStatus.InProgress,
        priority: TaskPriority.Yellow,
        dueDate: new Date(),
      };

      const mockUpdatedTask: Task = {
        id: taskId,
        name: updateTaskDto.name,
        dueDate: updateTaskDto.dueDate.toISOString(),
        status: updateTaskDto.status,
        priority: updateTaskDto.priority,
        dateCreated: new Date(),
        isActive: true,
      };

      jest.spyOn(service, 'updateTask').mockResolvedValue([mockUpdatedTask]);

      const result = await controller.updateTask(taskId, updateTaskDto);
      expect(result).toEqual([mockUpdatedTask]);
      expect(service.updateTask).toHaveBeenCalledWith(taskId, updateTaskDto);
    });

    it('should handle partial updates', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = {
        status: TaskStatus.Done,
      };

      const mockUpdatedTask: Task = {
        id: taskId,
        name: 'Existing Task',
        dueDate: new Date().toISOString(),
        status: updateTaskDto.status,
        priority: TaskPriority.Red,
        dateCreated: new Date(),
        isActive: true,
      };

      jest.spyOn(service, 'updateTask').mockResolvedValue([mockUpdatedTask]);

      const result = await controller.updateTask(taskId, updateTaskDto);
      expect(result).toEqual([mockUpdatedTask]);
      expect(service.updateTask).toHaveBeenCalledWith(taskId, updateTaskDto);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const taskId = 1;
      jest.spyOn(service, 'deleteTask').mockResolvedValue(undefined);

      await controller.deleteTask(taskId);
      expect(service.deleteTask).toHaveBeenCalledWith(taskId);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      const taskId = 1;
      const mockTask: Task = {
        id: taskId,
        name: 'Test Task',
        dueDate: new Date().toISOString(),
        status: TaskStatus.Pending,
        priority: TaskPriority.Red,
        dateCreated: new Date(),
        isActive: true,
      };

      jest.spyOn(service, 'getTaskById').mockResolvedValue([mockTask]);

      const result = await controller.getTaskById(taskId);
      expect(result).toEqual([mockTask]);
      expect(service.getTaskById).toHaveBeenCalledWith(taskId);
    });
  });

  describe('getTasks', () => {
    it('should return paginated tasks with filters', async () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          name: 'Task 1',
          dueDate: new Date().toISOString(),
          status: TaskStatus.Pending,
          priority: TaskPriority.Red,
          dateCreated: new Date(),
          isActive: true,
        },
        {
          id: 2,
          name: 'Task 2',
          dueDate: new Date().toISOString(),
          status: TaskStatus.Done,
          priority: TaskPriority.Yellow,
          dateCreated: new Date(),
          isActive: true,
        },
      ];

      const filter = { status: TaskStatus.Pending };
      const page = 1;
      const limit = 10;
      const total = 2;

      jest.spyOn(service, 'getAllTasks').mockResolvedValue(mockTasks);
      jest.spyOn(service, 'countTasks').mockResolvedValue([{ count: total }]);

      const result = await controller.getTasks(filter, page, limit);
      expect(result).toEqual({
        tasks: mockTasks,
        total: [{ count: total }],
        page,
        pages: total > 0 ? Math.ceil(total / limit) : 0,
      });
      expect(service.getAllTasks).toHaveBeenCalledWith(filter, page, limit);
      expect(service.countTasks).toHaveBeenCalledWith(filter);
    });

    it('should handle empty results', async () => {
      const filter = { status: 'NonExistent' };
      const page = 1;
      const limit = 10;
      const total = 0;

      jest.spyOn(service, 'getAllTasks').mockResolvedValue([]);
      jest.spyOn(service, 'countTasks').mockResolvedValue([{ count: total }]);

      const result = await controller.getTasks(filter, page, limit);
      expect(result).toEqual({
        tasks: [],
        total: [{ count: total }],
        page,
        pages: total > 0 ? Math.ceil(total / limit) : 0,
      });
    });
  });
});
