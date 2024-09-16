// src/repositories/GenericRepository.ts

import { Model, FindOptions, ModelStatic } from 'sequelize';
import { IGenericRepository } from './IGenericRepository';
import { MakeNullishOptional } from 'sequelize/types/utils';

export class GenericRepository<
  T extends Model<TAttributes, TCreationAttributes>,
  TAttributes extends object,
  TCreationAttributes extends object,
> implements IGenericRepository<T, TAttributes, TCreationAttributes>
{
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async getAll(options?: FindOptions<TAttributes>): Promise<T[]> {
    return await this.model.findAll(options);
  }

  async getById(id: number, options?: FindOptions<TAttributes>): Promise<T | null> {
    return await this.model.findByPk(id, options);
  }

  async create(data: TCreationAttributes | undefined): Promise<T> {
    return await this.model.create(data as unknown as MakeNullishOptional<T["_creationAttributes"]>);
  }

  async update(id: number, data: Partial<TAttributes>): Promise<T | null> {
    const instance = await this.model.findByPk(id);
    if (!instance) {
      return null;
    }
    await instance.update(data as TAttributes);
    return instance;
  }

  async delete(id: number): Promise<boolean> {
    const instance = await this.model.findByPk(id);
    if (!instance) {
      return false;
    }
    await instance.destroy();
    return true;
  }
}
