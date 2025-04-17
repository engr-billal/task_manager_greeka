export class CreateTaskDto {
  name: string;
  dueDate: Date;
  status: 'Pending' | 'Done' | 'InProgress' | 'Paused';
  priority: 'Red' | 'Yellow' | 'Blue';
}

export class UpdateTaskDto {
  name?: string;
  dueDate?: Date;
  status?: 'Pending' | 'Done' | 'InProgress' | 'Paused';
  priority?: 'Red' | 'Yellow' | 'Blue';
}
