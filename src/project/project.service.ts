import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Project } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto';

@Injectable()
export class ProjectService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<Project[]> {
    try {
      const projects = await this.prismaService.project.findMany();
      if (!projects) throw new NotFoundException('No projects found');
      return projects;
    } catch (error) {
      console.error('ERROR: could not find projects', error);
      throw new BadRequestException();
    }
  }

  async findProjectMembers(projectId: number, userId: number) {
    const userInProject = await this.prismaService.usersOnProjects.findFirst({
      where: { projectId, userId },
    });

    const project = await this.prismaService.project.findUnique({
      where: { id: projectId },
      include: { admin: true },
    });

    if (!project) throw new NotFoundException('Project not found');

    const isAdmin = project.adminId === userId;

    if (!isAdmin && !userInProject) {
      throw new UnauthorizedException(
        "You don't have permission to access this project",
      );
    }

    const members = await this.prismaService.usersOnProjects.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            image: true,
            isActive: true,
          },
        },
      },
    });

    if (members.length === 0)
      throw new NotFoundException('Project has no members');

    return members.map((user) => user.user);
  }

  // usuário quer buscar um projeto que ele está relacionado, seja um usuário ou admin
  // adicionar filtragem por título
  async findOne(id: number): Promise<Project> {
    const project = await this.prismaService.project.findUnique({
      where: { id },
    });

    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async createAdminProject(
    adminId: number,
    project: CreateProjectDto,
  ): Promise<Project> {
    const newProject = await this.prismaService.project.create({
      data: {
        title: project.title,
        image: project.image,
        startDate: project.startDate,
        endDate: project.startDate,
        isActive: project.isActive,
        adminId: adminId,
        users: {
          connect: { id: adminId },
        },
      },
    });

    if (!newProject) throw new BadRequestException('Project not created');

    return newProject;
  }

  async addUsersToProject(
    projectId: number,
    adminId: number,
    usersIds: number[],
  ) {
    const project = await this.prismaService.project.findUnique({
      where: { id: projectId },
      include: { admin: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.adminId !== adminId) {
      throw new UnauthorizedException("You don't have permission!");
    }

    if (usersIds.length < 1) throw new NotFoundException('Data not found');

    if (usersIds.indexOf(adminId) !== -1)
      throw new BadRequestException('Admin cannot be added as a regular user');

    try {
      if (!Array.isArray(usersIds)) {
        throw new Error('usersId must be an array');
      }

      await this.prismaService.usersOnProjects.createMany({
        data: usersIds.map((userId) => ({
          userId: userId,
          projectId: projectId,
        })),
        skipDuplicates: true,
      });

      return { message: 'Users added to project successfully' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error adding users to the project');
    }
  }

  // verify admin permission asap
  async update(project: Project) {
    try {
      const { id, title, image, startDate, endDate, isActive } = project;

      const existingProject = this.findOne(project.id);
      if (!existingProject) throw new NotFoundException('Project not found');

      const updatedProject = await this.prismaService.project.update({
        where: { id: id },
        data: {
          title,
          image,
          startDate,
          endDate,
          isActive,
        },
      });
      if (!updatedProject) throw new BadRequestException('Project not updated');
      return updatedProject;
    } catch (error) {
      console.error('ERROR: project not updated', error);
      throw new BadRequestException();
    }
  }

  // verify admin permission
  // create transaction to remove all related data
  async delete(id: number): Promise<void> {
    await this.prismaService.project.delete({ where: { id } });
  }
}
