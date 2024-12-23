export interface IRepository<T, ID> {
  create(data: Partial<T>): Promise<T>;
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: ID, data: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}
