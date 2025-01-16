import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { formatProject } from 'src/common/helpers';
import { FormattedProject } from 'src/common/interfaces';
import { UpdateProjectDto } from '../dto';
import { ProjectRepository } from '../project.repository';

@Injectable()
export class AdminProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async addUsersToProject(
    projectId: number,
    adminId: number,
    usersIds: number[],
  ): Promise<{ message: string }> {
    if (usersIds.length < 1)
      throw new NotFoundException("You didn't add any user!");

    if (usersIds.indexOf(adminId) !== -1)
      throw new UnauthorizedException(
        'Admin cannot be added as a regular user',
      );

    const addUsersToProject = await this.projectRepository.addUsersToProject(
      projectId,
      usersIds,
    );
    if (!addUsersToProject) throw new BadRequestException('Users not added');
    return { message: 'User(s) added to project successfully!' };
  }

  async updateProject(
    updateProjectDto: UpdateProjectDto,
    projectId: number,
    userId: number,
  ): Promise<FormattedProject> {
    await this.projectRepository.findById(projectId);

    const data = {};
    Object.entries(updateProjectDto).forEach((obj) => {
      data[obj[0]] = obj[1];
    });

    const project = await this.projectRepository.update(projectId, data);
    return formatProject(project, userId);
  }

  async deleteProject(projectId: number): Promise<{ message: string }> {
    return await this.projectRepository.delete(projectId);
  }
}
