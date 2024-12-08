import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskRepository {
  constructor(private prismaService: PrismaService) {}
  
  async create(boardId: number, data: Prisma.TaskCreateInput): Promise<Task> {
    return await this.prismaService.task.create({ data });
  }
  
  async findById(boardId: number, taskId: number): Promise<Task> {
    return await this.prismaService.task.findFirst({
      where: { id: taskId, boardId },
    });
  }

  async update(taskId: number, data: Prisma.TaskUpdateInput): Promise<Task> {
    return await this.prismaService.task.update({
      where: { id: taskId },
      data,
    });
  }

  async delete(taskId: number): Promise<void> {
    await this.prismaService.task.delete({ where: { id: taskId } });
  }
}
