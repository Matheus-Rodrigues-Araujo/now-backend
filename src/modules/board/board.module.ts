import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectAdminGuard } from '../project/guards/project-admin.guard';
import { ProjectGuard } from '../project/guards/project.guard';
import { BoardRepository } from './board.repository';
import { ProjectRepository } from '../project/project.repository';
import { HistoryModule } from '../history/history.module';
import { HistoryRepository } from '../history/history.repository';
import { HistoryService } from '../history/history.service';

@Module({
  controllers: [BoardController],
  providers: [
    BoardService,
    BoardRepository,
    HistoryService,
    HistoryRepository,
    PrismaService,
    ProjectGuard,
    ProjectRepository,
    ProjectAdminGuard,
  ],
})
export class BoardModule {}
