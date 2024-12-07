import { Injectable } from '@nestjs/common';
import { Board, Prisma, Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BoardRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: Prisma.BoardCreateInput): Promise<Board> {
    return await this.prismaService.board.create({ data });
  }

  async findBoardsFromProject(projectId: number): Promise<Board[]> {
    return await this.prismaService.board.findMany({
      where: { projectId },
    });
  }

  async findAllBoardTasks(boardId: number, projectId: number): Promise<Task[]> {
    const board = await this.prismaService.board.findFirst({
      where: { id: boardId, projectId },
      include: {
        tasks: true,
      },
    });

    return board.tasks;
  }

  async findBoardsWithTasks(
    projectId: number,
  ): Promise<Prisma.BoardGetPayload<{ include: { tasks: true } }>[]> {
    return await this.prismaService.board.findMany({
      where: { projectId },
      include: {
        tasks: true,
      },
    });
  }

  async findById(boardId: number, projectId: number): Promise<Board> {
    return await this.prismaService.board.findUnique({
      where: { id: boardId, projectId },
    });
  }

  async findByTitle(title: string): Promise<Board> {
    return await this.prismaService.board.findFirst({ where: { title } });
  }

  async update(
    boardId: number,
    projectId: number,
    data: Prisma.BoardUpdateInput,
  ): Promise<Board> {
    return await this.prismaService.board.update({
      where: { id: boardId, projectId },
      data,
    });
  }

  async updateOrder(boards: { id: number; order: number }[]): Promise<Board[]> {
    const sortedBoards = boards.map((board) => {
      return this.prismaService.board.update({
        where: { id: board.id },
        data: { order: board.order },
      });
    });

    return await Promise.all(sortedBoards);
  }

  async delete(boardId: number): Promise<void> {
    await this.prismaService.$transaction([
      this.prismaService.task.deleteMany({ where: { boardId } }),
      this.prismaService.board.delete({ where: { id: boardId } }),
    ]);
  }
}
