import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Board, Prisma, Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardDto, UpdateBoardDto } from './dto';
import { BoardRepository } from './board.repository';

@Injectable()
export class BoardService {
  constructor(
    private prismaService: PrismaService,
    private readonly boardRepository: BoardRepository,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    if (!createBoardDto) throw new BadRequestException('Fiels empty');
    const { title, theme, projectId } = createBoardDto;

    const board = await this.boardRepository.create({
      title,
      theme: theme as Prisma.JsonObject,
      project: {
        connect: {
          id: projectId,
        },
      },
    });

    if (!board) throw new BadRequestException('Failed to create the board');
    return board;
  }

  async findBoardsFromProject(projectId: number): Promise<Board[]> {
    const boards = await this.boardRepository.findBoardsFromProject(projectId);
    return boards;
  }

  async findById(boardId: number, projectId: number): Promise<Board> {
    const board = await this.boardRepository.findById(boardId, projectId);
    if (!board) throw new NotFoundException('Board not found');
    return board;
  }

  async findAllBoardTasks(boardId: number, projectId: number): Promise<Task[]> {
    return await this.boardRepository.findAllBoardTasks(boardId, projectId);
  }

  async findBoardsWithTasks(
    projectId: number,
  ): Promise<Prisma.BoardGetPayload<{ include: { tasks: true } }>[]> {
    const boardsAndTasks =
      await this.boardRepository.findBoardsWithTasks(projectId);

    if (!boardsAndTasks)
      throw new NotFoundException('No boards and tasks created');

    return boardsAndTasks;
  }

  async update(
    boardId: number,
    projectId: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    const { title, theme } = updateBoardDto;
    const data: Prisma.BoardUpdateInput = {};

    if (title !== undefined) data.title = title;
    if (theme !== undefined) data.theme = theme as Prisma.JsonObject;

    const updatedBoard = await this.boardRepository.update(
      boardId,
      projectId,
      data,
    );

    if (!updatedBoard) throw new BadRequestException('Board not updated');
    return updatedBoard;
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

  async delete(boardId: number, projectId: number): Promise<void> {
    await this.findById(boardId, projectId);
    await this.boardRepository.delete(boardId);
  }
}
