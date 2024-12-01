import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Board, Prisma, Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardDto, UpdateBoardDto } from './dto';
import { validateAdmin, validateUserOrAdmin } from 'src/common/validators';

@Injectable()
export class BoardService {
  constructor(private prismaService: PrismaService) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    if (!createBoardDto) throw new NotFoundException('Fiels empty');
    const newBoard = await this.prismaService.board.create({
      data: {
        title: createBoardDto.title,
        theme: createBoardDto.theme as Prisma.JsonObject,
        projectId: createBoardDto.projectId,
      },
    });

    if (!newBoard) throw new BadRequestException('Failed to create the board');
    return newBoard;
  }

  async findOne(
    boardId: number,
    projectId: number,
    userId: number,
  ): Promise<Board> {
    await validateUserOrAdmin(this.prismaService, projectId, userId);
    const board = await this.prismaService.board.findUnique({
      where: { id: boardId, projectId },
    });
    if (!board) throw new NotFoundException('Board not found!');

    return board;
  }

  async findAllBoardTasks(
    boardId: number,
    projectId: number,
    userId: number,
  ): Promise<Task[]> {
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
  ): Promise<Board> {
    const { title, theme } = updateBoardDto;
    const dataToUpdate: Partial<Prisma.BoardUpdateInput> = {};

    if (title !== undefined) dataToUpdate.title = title;
    if (theme !== undefined) dataToUpdate.theme = theme as Prisma.JsonObject;

    const updatedBoard = await this.prismaService.board.update({
      where: { id: boardId, projectId },
      data: dataToUpdate,
    });

    if (!updatedBoard) throw new BadRequestException('Board not updated');
    return await this.findOne(boardId, projectId, userId);
  }

  async delete(
    boardId: number,
    projectId: number,
    userId: number,
  ): Promise<{ message: string }> {
    await validateAdmin(this.prismaService, projectId, userId);

    try {
      await this.prismaService.$transaction([
        this.prismaService.task.deleteMany({ where: { boardId } }),
        this.prismaService.board.delete({ where: { id: boardId } }),
      ]);
      return { message: 'Project deleted successfully' };
    } catch (error) {
      throw new BadRequestException(`Project could not be deleted: ${error}`);
    }
  }
}
