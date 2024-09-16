// src/repositories/IGenericRepository.ts

import { FindOptions, Model } from 'sequelize';

export interface IGenericRepository<
  T extends Model<TAttributes, TCreationAttributes>,
  TAttributes extends object, // Added extends {} constraint
  TCreationAttributes extends object, // Added extends {} constraint
> {
  getAll(options?: FindOptions<TAttributes>): Promise<T[]>;
  getById(id: number, options?: FindOptions<TAttributes>): Promise<T | null>;
  create(data: TCreationAttributes): Promise<T>;
  update(id: number, data: Partial<TAttributes>): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}
