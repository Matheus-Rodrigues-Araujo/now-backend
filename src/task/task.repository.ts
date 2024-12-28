import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MoveTaskDto, UpdateTaskDto, UpdateTaskOrderDto } from './dto';
import { HistoryService } from 'src/history/history.service';
import { JwtPayload } from 'src/common/interfaces';
import { Action_Type, Entity_Type } from 'src/history/history.constants';

@Injectable()
export class TaskRepository {
  constructor(
    private prismaService: PrismaService,
    private historyService: HistoryService,
  ) {}

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

  async createTask(
    user: JwtPayload['user'],
    boardId: number,
    data: Prisma.TaskCreateInput,
  ): Promise<Task> {
    return this.prismaService.$transaction(async (prisma) => {
      const task = await this.create(boardId, data);
      if (!task) throw new BadRequestException('Task not created');

      const { sub, firstName, lastName } = user;
      const userId = sub;
      const userName = firstName + ' ' + lastName;
      await this.historyService.createHistory(userId, task.id, {
        description: `${userName} created task: ${data.title}`,
        entityType: Entity_Type.TASK,
        actionType: Action_Type.CREATE,
      });

      return task;
    });
  }

  async updateTask(
    taskId: number,
    user: JwtPayload['user'],
    data: Prisma.TaskUpdateInput,
  ): Promise<Task> {
    return this.prismaService.$transaction(async (prisma) => {
      const task = await this.update(taskId, data);

      const { sub, firstName, lastName } = user;
      const userId = sub;
      const userName = firstName + ' ' + lastName;

      await this.historyService.createHistory(userId, taskId, {
        description: `${userName} updated task: ${task.title}`,
        entityType: Entity_Type.TASK,
        actionType: Action_Type.UPDATE,
      });

      return task;
    });
  }

  async deleteTask(taskId: number, user: JwtPayload['user']): Promise<void> {
    this.prismaService.$transaction(async (prisma) => {
      const task = await this.delete(taskId);

      const { sub, firstName, lastName } = user;
      const userId = sub;
      const userName = firstName + ' ' + lastName;

      await this.historyService.createHistory(userId, taskId, {
        description: `${userName} deleted task with Id: ${taskId}`,
        entityType: Entity_Type.TASK,
        actionType: Action_Type.DELETE,
      });
    });
  }
}
