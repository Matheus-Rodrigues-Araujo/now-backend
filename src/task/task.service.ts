import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findTaskById(taskId: number, boardId: number): Promise<Task> {
    const task = await this.taskRepository.findById(taskId, boardId);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async createTask(
    boardId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return await this.taskRepository.create(boardId, {
      ...createTaskDto,
      board: {
        connect: {
          id: boardId,
        },
      },
    });
  }

  async updateTask(
    taskId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return await this.taskRepository.update(taskId, updateTaskDto);
  }

  async moveTaskToBoard(
    boardId: number,
    taskId: number,
    moveTaskDto: MoveTaskDto,
  ): Promise<Task> {
    return await this.taskRepository.moveTaskToBoard(
      boardId,
      taskId,
      moveTaskDto,
    );
  }

  async deleteTask(boardId: number, taskId: number): Promise<void> {
    const task = await this.taskRepository.findById(boardId, taskId);
    if (!task) throw new NotFoundException('Task not found in this board');
    await this.taskRepository.delete(taskId);
  }
}
