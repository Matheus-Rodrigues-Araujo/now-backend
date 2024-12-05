import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { AdminProjectController } from './controllers/admin-project.controller';
import { ProjectService } from './services/project.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminProjectService } from './services/admin-project.service';
import { ProjectRepository } from './project.repository';

@Module({
  controllers: [ProjectController, AdminProjectController],
  providers: [
    ProjectService,
    AdminProjectService,
    PrismaService,
    ProjectRepository,
  ],
})
export class ProjectModule {}
