import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectAdminGuard } from '../project/guards/project-admin.guard';
import { ProjectGuard } from '../project/guards/project.guard';
import { ProjectRepository } from '../project/project.repository';
import { HistoryService } from '../history/history.service';
import { HistoryRepository } from '../history/history.repository';

@Module({
  controllers: [TaskController],
  providers: [
    TaskService,
    TaskRepository,
    PrismaService,
    ProjectGuard,
    ProjectAdminGuard,
    ProjectRepository,
    HistoryService,
    HistoryRepository
  ],
})
export class TaskModule {}
