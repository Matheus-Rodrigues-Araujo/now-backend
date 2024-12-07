import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findById(taskId: number, boardId: number): Promise<Task> {
    const task = await this.taskRepository.findById(taskId, boardId);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async createTask(boardId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.create(boardId, {
      ...createTaskDto,
      board: {
        connect: {
          id: boardId,
        },
      },
    });
  }

  async deleteTask(boardId:number, taskId: number): Promise<void> {
    const task = await this.taskRepository.findById(boardId, taskId)
    if(!task) throw new NotFoundException("Task not found in this board")
    await this.taskRepository.delete(taskId);
  }
}
