import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { Prisma, Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto';
import { JwtPayload } from 'src/common/interfaces';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findTaskById(taskId: number, boardId: number): Promise<Task> {
    const task = await this.taskRepository.findById(taskId, boardId);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  private prepareTaskCreationData(
    boardId: number,
    createTaskDto: CreateTaskDto,
  ): Prisma.TaskCreateInput {
    return {
      ...createTaskDto,
      board: {
        connect: {
          id: boardId,
        },
      },
    };
  }

  async createTask(
    user: JwtPayload['user'],
    boardId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const taskData = this.prepareTaskCreationData(boardId, createTaskDto);
    return this.taskRepository.createTask(user, boardId, taskData);
  }

  async updateTask(
    taskId: number,
    user: JwtPayload['user'],
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskRepository.updateTask(
      taskId,
      user,
      updateTaskDto,
    );
    if (!task) throw new BadRequestException('Task not updated');

    return task;
  }

  async deleteTask(
    boardId: number,
    taskId: number,
    user: JwtPayload['user'],
  ): Promise<void> {
    const task = await this.taskRepository.findById(boardId, taskId);
    if (!task) throw new NotFoundException('Task not found in this board');
    await this.taskRepository.deleteTask(taskId, user);
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
}
