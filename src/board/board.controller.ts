import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateBoardDto } from './dto';
import { BoardService } from './board.service';
import { AuthenticateRequest } from 'src/types';

@Controller('boards')
@UseGuards(AuthGuard)
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  async create(@Body() board: CreateBoardDto) {
    return await this.boardService.create(board);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @Body() body: any,
    @Request() req: AuthenticateRequest,
  ) {
    const { projectId } = body;
    await this.boardService.delete(id, projectId, req.user.sub);
  }

  //   @Get(':id')
  //   async findAllBoardTasks(@Param('id', ParseIntPipe) id: number, @Body() body:any, @Request() req) {
  //     return this.boardService.findAllBoardTasks(id, );
  //   }
}
