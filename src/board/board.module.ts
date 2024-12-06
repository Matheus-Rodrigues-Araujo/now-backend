import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BoardAccessGuard } from './guards/board-access.guard';

@Module({
  controllers: [BoardController],
  providers: [BoardService, PrismaService, BoardAccessGuard]
})
export class BoardModule {}
