export interface ProjectModel {
  id: number;
  title: string;
  image: string | null;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  adminId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormattedProject
  extends Omit<Partial<ProjectModel>, 'adminId'> {
  isAdmin?: boolean;
}
