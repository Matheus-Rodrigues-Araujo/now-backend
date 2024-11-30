import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardDto, UpdateBoardDto } from './dto';
import { validateAdmin, validateUserOrAdmin } from 'src/common/validators';

@Injectable()
export class BoardService {
  constructor(private prismaService: PrismaService) {}

  async create(board: CreateBoardDto) {
    if (!board) throw new NotFoundException('Fiels empty');
    const newBoard = await this.prismaService.board.create({
      data: {
        title: board.title,
        theme: board.theme as Prisma.JsonObject,
        projectId: board.projectId,
      },
    });

    if (!newBoard) throw new BadRequestException('Failed to create the board');
    return newBoard;
  }

  async findOne(boardId: number, projectId: number, userId: number) {
    await validateUserOrAdmin(this.prismaService, projectId, userId);
    const board = await this.prismaService.board.findUnique({
      where: { id: boardId, projectId },
    });
    if (!board) throw new NotFoundException('Board not found!');

    return board;
  }

  async findAllBoardTasks(boardId: number, projectId: number, userId: number) {
    await validateUserOrAdmin(this.prismaService, projectId, userId);

    const board = await this.prismaService.board.findFirst({
      where: { id: boardId, projectId },
      include: {
        tasks: true,
      },
    });

    if (!board) throw new NotFoundException('Board not found');

    return board.tasks;
  }

  async update(
    updateBoardDto: UpdateBoardDto,
    boardId: number,
    projectId: number,
    userId: number,
  ) {

    const updatedBoard = await this.prismaService.board.update({
      where: { id: boardId, projectId },
      data: {
        title: updateBoardDto.title,
        theme: updateBoardDto.theme as Prisma.JsonObject,
      },
    });

    if (!updatedBoard) throw new BadRequestException('Board not updated');
    return await this.findOne(boardId, projectId, userId);
  }

  async delete(boardId: number, projectId: number, userId: number) {
    await validateAdmin(this.prismaService, projectId, userId);

    await this.prismaService.$transaction([
      this.prismaService.task.deleteMany({ where: { boardId } }),
      this.prismaService.board.delete({ where: { id: boardId } }),
    ]);
  }
}
