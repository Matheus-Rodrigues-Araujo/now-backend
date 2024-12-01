import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Project } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto, FindProjectDto } from './dto';
import { FormattedProject } from '../types';
import { validateAdmin, validateUser } from 'src/common/validators';

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

  async findOne(id: number) {
    const project = await this.prismaService.project.findUnique({
      where: { id },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async findOneByIdOrTitle(
    param: FindProjectDto,
    userId: number,
  ): Promise<FormattedProject> {
    const { id, title } = param;

    if (!id && !title)
      throw new BadRequestException('You must provide either an ID or a title');

    const project = await this.prismaService.project.findFirst({
      where: {
        OR: [{ id: id }, { title }],
      },
      include: {
        UsersOnProjects: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!project) throw new NotFoundException('Project not found');

    await validateUser(this.prismaService, project.id, userId);

    const formattedProject: FormattedProject = {
      id: project.id,
      title: project.title,
      image: project.image,
      startDate: project.startDate,
      endDate: project.endDate,
      isActive: project.isActive,
      isAdmin: project.adminId === userId,
    };
    return formattedProject;
  }

  async createProjectAsAdmin(
    adminId: number,
    project: CreateProjectDto,
  ): Promise<Project> {
    const existingProject = await this.prismaService.project.findUnique({
      where: { title: project.title },
    });

    if (existingProject && existingProject.title === project.title)
      throw new BadRequestException('Título está sendo utilizado!');

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

  // verify admin permission asap
  async update(project: Project, userId: number) {
    try {
      const { id, title, image, startDate, endDate, isActive } = project;

      const existingProject = this.findOneByIdOrTitle(
        { id: project.id },
        userId,
      );
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

  async delete(
    projectId: number,
    userId: number,
  ): Promise<{ message: string }> {
    await validateAdmin(this.prismaService, projectId, userId);

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
}
