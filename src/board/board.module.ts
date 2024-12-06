import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectAdminGuard } from 'src/project/guards/project-admin.guard';
import { ProjectGuard } from 'src/project/guards/project.guard';
import { BoardRepository } from './board.repository';
import { ProjectRepository } from 'src/project/project.repository';

@Module({
  controllers: [BoardController],
  providers: [
    BoardService,
    BoardRepository,
    PrismaService,
    ProjectGuard,
    ProjectRepository,
    ProjectAdminGuard,
  ],
})
export class BoardModule {}
