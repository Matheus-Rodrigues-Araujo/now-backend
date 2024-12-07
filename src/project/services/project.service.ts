import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Project } from '@prisma/client';
import { CreateProjectDto, FindProjectDto } from '../dto';
import { FormattedProject } from 'src/types';
import { ProjectRepository } from '../project.repository';
import { formatProject } from 'src/common/helpers';

@Injectable()
export class ProjectService {
  constructor(private readonly projecRepository: ProjectRepository) {}

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

  async createProjectAsAdmin(
    createProjectDto: CreateProjectDto,
    userId: number,
  ): Promise<Project> {
    const { title, image, startDate, endDate, isActive } = createProjectDto;
    const existingProject = await this.projecRepository.findByTitleAndAdminId(
      title,
      userId,
    );

    if (existingProject)
      throw new BadRequestException(
        'You already have a project with this title',
      );

    const project = await this.projecRepository.create({
      title,
      image,
      startDate,
      endDate,
      isActive,
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

    if (!project) throw new BadRequestException('Project not created');

    return project;
  }

  async findProjectMembers(projectId: number) {
    const members = await this.projecRepository.findMembers(projectId);
    if (members.length === 0)
      throw new NotFoundException('Project has no members');

    return members.map((user) => user.user);
  }
}
