import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Project } from '@prisma/client';
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

  async createAdminProject(
    userId: number,
    firstName: string,
    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    // const existingProject = await this.projecRepository.findByTitleAndAdminId(
    //   createProjectDto.title,
    //   userId,
    // );

    // if (existingProject)
    //   throw new BadRequestException(
    //     'You already have a project with this title',
    //   );

    // const project = await this.projecRepository.create({
    //   ...createProjectDto,
    //   admin: {
    //     connect: { id: userId },
    //   },
    //   users: {
    //     connect: { id: userId },
    //   },
    //   UsersOnProjects: {
    //     create: {
    //       userId: userId,
    //       role: 'PROJECT_ADMIN',
    //     },
    //   },
    // });

    // await this.historyService.createHistory(userId, project.id, {
    //   description: `Created project as admin: ${project.title}`,
    //   actionType: Action_Type.CREATE,
    //   entityType: Entity_Type.PROJECT
    // });

    return await this.projecRepository.createAdminProject(userId, firstName, {
      ...createProjectDto,
      admin: {
        connect: { id: userId },
      },
      users: {
        connect: { id: userId },
      },
      UsersOnProjects: {
        create: {
          userId: userId,
          role: 'PROJECT_ADMIN',
        },
      },
    });
  }

  async findProjectMembers(projectId: number) {
    const members = await this.projecRepository.findMembers(projectId);
    if (members.length === 0)
      throw new NotFoundException('Project has no members');

    return members.map((user) => user.user);
  }
}
