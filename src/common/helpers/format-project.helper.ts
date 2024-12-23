import { ProjectModel, FormattedProject } from 'src/common/interfaces';

export function formatProject(
  project: ProjectModel,
  userId: number,
): FormattedProject {
  const formattedProject: FormattedProject = {};

  const adminId = project.adminId;
  delete project.adminId;

  Object.entries(project).forEach(([key, value]) => {
    formattedProject[key] = value;
  });
  formattedProject['isAdmin'] = adminId === userId;

  return formattedProject;
}
