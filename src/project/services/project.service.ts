import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { CreateProjectDto, FindProjectDto } from '../dto';
import { Action_Type, Entity_Type, FormattedProject } from 'src/types';
import { ProjectRepository } from '../project.repository';
import { formatProject } from 'src/common/helpers';
import { HistoryService } from 'src/history/history.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projecRepository: ProjectRepository,
    private readonly historyService: HistoryService,
  ) {}

  async findProjectByIdOrTitle(
    query: FindProjectDto,
    userId: number,
  ): Promise<FormattedProject> {
    const { id, title } = query;

    if (id) {
      const project = await this.projecRepository.findById(id);
      return formatProject(project, userId);
    } else if (title) {
      const project = await this.projecRepository.findByTitle(title);
      return formatProject(project, userId);
    }
  }

  private prepareProjectCreationData(
    userId: number,
    createProjectDto: CreateProjectDto,
  ): Prisma.ProjectCreateInput {
    return {
      ...createProjectDto,
      admin: {
        connect: { id: userId },
      },
      users: {
        connect: {
          id: userId,
        },
      },
      UsersOnProjects: {
        create: {
          userId,
          role: 'PROJECT_ADMIN',
        },
      },
    };
  }

  async createAdminProject(
    userId: number,
    firstName: string,
    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    await this.validateProjectExistence(userId, createProjectDto.title);

    const projectData = this.prepareProjectCreationData(userId, createProjectDto);
    
    return await this.projecRepository.createProjectWithHistory(
      userId,
      firstName,
      projectData,
    );
  }

  private async validateProjectExistence(userId: number, title: string) {
    const existingProject = await this.projecRepository.findExistingProject(
      userId,
      title,
    );
    if (existingProject) {
      throw new BadRequestException(
        'You already have a project with this title',
      );
    }
  }

  async findProjectMembers(projectId: number) {
    const members = await this.projecRepository.findMembers(projectId);
    if (members.length === 0)
      throw new NotFoundException('Project has no members');

    return members.map((user) => user.user);
  }
}
