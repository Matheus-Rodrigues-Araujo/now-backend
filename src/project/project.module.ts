import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { AdminProjectController } from './controllers/admin-project.controller';
import { ProjectService } from './services/project.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminProjectService } from './services/admin-project.service';
import { ProjectRepository } from './project.repository';
import { ProjectAdminGuard } from './guards/project-admin.guard';
import { ProjectGuard } from './guards/project.guard';
import { HistoryService } from 'src/history/history.service';
import { HistoryRepository } from 'src/history/history.repository';

@Module({
  controllers: [ProjectController, AdminProjectController],
  providers: [
    ProjectService,
    HistoryService,
    HistoryRepository,
    AdminProjectService,
    PrismaService,
    ProjectRepository,
    ProjectAdminGuard,
    ProjectGuard,
  ],
  exports: [ProjectGuard, ProjectAdminGuard],
})
export class ProjectModule {}
