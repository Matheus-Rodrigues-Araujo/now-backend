import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Post,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateBoardDto, UpdateBoardDto } from './dto';
import { BoardService } from './board.service';
import { JwtPayload } from 'src/types';
import { Board, Task } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return await this.boardService.create(createBoardDto);
  }

  @Get(':id/tasks')
  async findAllBoardTasks(
    @Param('id', ParseIntPipe) id: number,
    @Query('projectId', ParseIntPipe) projectId: number,
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<Task[]> {
    const userId = user.sub;
    return await this.boardService.findAllBoardTasks(id, projectId, userId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('projectId', ParseIntPipe) projectId: number,
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<Board> {
    const userId = user.sub;
    return await this.boardService.findOne(id, projectId, userId);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Query('projectId') projectId: number,
    @Body() updateBoardDto: UpdateBoardDto,
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<Board> {
    const userId = user.sub;

    return await this.boardService.update(
      updateBoardDto,
      id,
      projectId,
      userId,
    );
  }

  @Put('order')
  async updateOrder(@Body() newOrder: { id: number; order: number }[]) {
    return await this.boardService.updateOrder(newOrder);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @Query('projectId', ParseIntPipe) projectId: number,
    @CurrentUser() user: JwtPayload['user'],
  ): Promise<{ message: string }> {
    const userId = user.sub;
    const response = await this.boardService.delete(id, projectId, userId);
    return response;
  }
}
