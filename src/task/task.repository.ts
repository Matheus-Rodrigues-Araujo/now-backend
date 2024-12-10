import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTaskBoardDto, UpdateTaskDto, UpdateTaskOrderDto } from './dto';

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

  async updateOrder(boardId: number, tasks: UpdateTaskOrderDto[]) {
    return this.prismaService.$transaction(
      tasks.map((task) => {
        return this.prismaService.task.update({
          where: { id: task.id },
          data: { order: task.order },
        });
      }),
    );
  }

  async updateTaskBoard(task: UpdateTaskBoardDto): Promise<Task> {
    return this.prismaService.$transaction(async (prisma) => {
      await prisma.task.updateMany({
        where: {
          boardId: task.previousBoardId,
          order: { gt: task.previousOrder },
        },
        data: { order: { decrement: 1 } },
      });

      const updateTask = await prisma.task.update({
        where: { id: task.id },
        data: { order: task.order, boardId: task.boardId },
      });

      await prisma.task.updateMany({
        where: { boardId: task.boardId, order: { gte: task.order } },
        data: { order: { increment: 1 } },
      });

      return updateTask;
    });
  }

  async delete(taskId: number): Promise<void> {
    await this.prismaService.task.delete({ where: { id: taskId } });
  }
}
