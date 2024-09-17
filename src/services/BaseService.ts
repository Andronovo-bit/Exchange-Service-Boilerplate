// src/services/BaseService.ts

import { GenericRepository } from '../repositories/generic/GenericRepository';
import { Model, FindOptions } from 'sequelize';

export abstract class BaseService<
  T extends Model<TAttributes, TCreationAttributes>,
  TAttributes extends object,
  TCreationAttributes extends object,
> {
  protected readonly repository: GenericRepository<T, TAttributes, TCreationAttributes>;

  constructor(repository: GenericRepository<T, TAttributes, TCreationAttributes>) {
    this.repository = repository;
  }

  public async getAll(options?: FindOptions<TAttributes>): Promise<T[]> {
    return this.repository.getAll(options);
  }

  public async getById(id: number, options?: FindOptions<TAttributes>): Promise<T | null> {
    return this.repository.getById(id, options);
  }

  public async create(data: TCreationAttributes): Promise<T> {
    return this.repository.create(data);
  }

  public async update(id: number, data: Partial<TAttributes>): Promise<T | null> {
    return this.repository.update(id, data);
  }

  public async delete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }

  public async findAll(options?: FindOptions<TAttributes>): Promise<T[]> {
    return this.repository.findAll(options);
  }

  public async findById(id: number, options?: FindOptions<TAttributes>): Promise<T | null> {
    return this.repository.findByPk(id, options);
  }
}
