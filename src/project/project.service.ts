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

  async findOne(id: number): Promise<Project> {
    const project = await this.prismaService.project.findUnique({
      where: { id },
    });

    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(id: number, project: CreateProjectDto): Promise<Project> {
    const newProject = await this.prismaService.project.create({
      data: {
        title: project.title,
        image: project.image,
        startDate: project.startDate,
        endDate: project.startDate,
        isActive: project.isActive,
        adminId: id,
        users: {
          connect: { id: id },
        },
      },
    });

    if (!newProject) throw new BadRequestException('Project not created');

    return newProject;
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
  async delete(id: number): Promise<void> {
    await this.prismaService.project.delete({ where: { id } });
  }
}
