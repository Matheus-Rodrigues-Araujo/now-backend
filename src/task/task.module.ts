import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectAdminGuard } from 'src/project/guards/project-admin.guard';
import { ProjectGuard } from 'src/project/guards/project.guard';
import { ProjectRepository } from 'src/project/project.repository';
import { HistoryService } from 'src/history/history.service';
import { HistoryRepository } from 'src/history/history.repository';

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
