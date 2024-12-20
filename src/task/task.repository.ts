import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MoveTaskDto, UpdateTaskDto, UpdateTaskOrderDto } from './dto';

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

  async moveTaskToBoard(
    boardId: number,
    taskId: number,
    moveTaskDto: MoveTaskDto,
  ): Promise<Task> {
    return this.prismaService.$transaction(async (prisma) => {
      await prisma.task.updateMany({
        where: {
          boardId,
          order: { gt: moveTaskDto.previousOrder },
        },
        data: { order: { decrement: 1 } },
      });

      const updateTask = await prisma.task.update({
        where: { id: taskId },
        data: { order: moveTaskDto.order, boardId: moveTaskDto.newBoardId },
      });

      await prisma.task.updateMany({
        where: {
          boardId: moveTaskDto.newBoardId,
          order: { gte: moveTaskDto.order },
        },
        data: { order: { increment: 1 } },
      });

      return updateTask;
    });
  }

  async delete(taskId: number): Promise<void> {
    await this.prismaService.task.delete({ where: { id: taskId } });
  }
}
