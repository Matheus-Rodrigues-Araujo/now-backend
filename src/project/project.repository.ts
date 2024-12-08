import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.ProjectCreateInput): Promise<Project> {
    return await this.prismaService.project.create({ data });
  }

  async findById(projectId: number): Promise<Project> {
    const project = await this.prismaService.project.findUnique({
      where: { id: projectId },
    });

    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async findByTitle(title: string): Promise<Project> {
    const project = await this.prismaService.project.findFirst({
      where: { title },
    });

    if (!project)
      throw new NotFoundException(`Project with title ${title} not found`);
    return project;
  }

  async findByTitleAndAdminId(title: string, adminId: number) {
    return await this.prismaService.project.findFirst({
      where: { title, adminId },
    });
  }

  async findByIdOrTitle(query: {
    id?: number;
    title?: string;
  }): Promise<Project> {
    const { id, title } = query;

    if (!id && !title)
      throw new BadRequestException('ID or Title must be provided');

    const project = this.prismaService.project.findFirst({
      where: {
        OR: [{ id: id || undefined }, { title: title || undefined }],
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async findMembers(projectId: number): Promise<any[]> {
    return await this.prismaService.usersOnProjects.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
            isActive: true,
          },
        },
      },
    });
  }

  async addUsersToProject(projectId: number, usersId: number[]) {
    return await this.prismaService.usersOnProjects.createMany({
      data: usersId.map((userId) => ({
        userId,
        projectId,
      })),
      skipDuplicates: true,
    });
  }

  async update(
    projectId: number,
    data: Prisma.ProjectUpdateInput,
  ): Promise<Project> {
    const project = await this.prismaService.project.update({
      where: { id: projectId },
      data,
    });
    if (!project) throw new NotFoundException('Project not updated');

    return project;
  }

  async delete(
    projectId: number,
  ): Promise<{ message: string }> {
    try {
      await this.prismaService.$transaction([
        this.prismaService.usersOnProjects.deleteMany({ where: { projectId } }),
        this.prismaService.task.deleteMany({ where: { board: { projectId } } }),
        this.prismaService.board.deleteMany({ where: { projectId } }),
        this.prismaService.project.delete({ where: { id: projectId } }),
      ]);

      return { message: 'Project deleted succesfully' };
    } catch {
      throw new BadRequestException('The project could not be deleted');
    }
  }

  async validateProjectUser(
    projectId: number,
    userId: number,
  ): Promise<boolean> {
    const isProjectUser = await this.prismaService.usersOnProjects.findFirst({
      where: { projectId, userId },
    });

    if (!isProjectUser)
      throw new UnauthorizedException(
        'Only project users can perform this action',
      );

    return true;
  }

  async validateProjectAdmin(
    projectId: number,
    userId: number,
  ): Promise<boolean> {
    const isProjectAdmin = await this.prismaService.usersOnProjects.findFirst({
      where: {
        userId,
        projectId,
        role: 'PROJECT_ADMIN',
      },
    });

    if (!isProjectAdmin)
      throw new UnauthorizedException('Only admins can perform this action');

    return true;
  }
}
