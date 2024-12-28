import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Board, Prisma, Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardDto, UpdateBoardDto, UpdateBoardOrder } from './dto';
import { BoardRepository } from './board.repository';

@Injectable()
export class BoardService {
  constructor(
    private prismaService: PrismaService,
    private readonly boardRepository: BoardRepository,
  ) {}

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
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
    if (!boards) throw new NotFoundException('Project has no boards');
    return boards;
  }

  async findBoardById(boardId: number, projectId: number): Promise<Board> {
    const board = await this.boardRepository.findById(boardId, projectId);
    if (!board) throw new NotFoundException('Board not found');
    return board;
  }

  async findAllBoardTasks(boardId: number, projectId: number): Promise<Task[]> {
    const boardTasks = await this.boardRepository.findAllBoardTasks(
      boardId,
      projectId,
    );
    if (!boardTasks) throw new NotFoundException("Board don't have any task");
    return boardTasks;
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

  async updateBoard(
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

  async updateBoardsOrder(
    projectId: number,
    boards: UpdateBoardOrder[],
  ): Promise<Board[]> {
    const boardsOrder = await this.boardRepository.updateOrder(
      projectId,
      boards,
    );
    if (!boardsOrder) throw new BadRequestException('Board(s) order updated');
    return boardsOrder;
  }

  async deleteBoard(boardId: number, projectId: number): Promise<void> {
    await this.findBoardById(boardId, projectId);
    await this.boardRepository.delete(boardId);
  }
}
