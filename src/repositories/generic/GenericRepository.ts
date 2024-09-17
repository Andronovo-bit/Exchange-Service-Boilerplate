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
  protected readonly model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  /**
   * Get all instances of the model.
   * @param options - Options for the query.
   * @returns A promise that resolves to an array of instances.
   */
  public async getAll(options?: FindOptions<TAttributes>): Promise<T[]> {
    return this.model.findAll(options);
  }

  /**
   * Get an instance of the model by its primary key.
   * @param id - The primary key of the instance.
   * @param options - Options for the query.
   * @returns A promise that resolves to the instance if found, or null if not.
   */
  public async getById(id: number, options?: FindOptions<TAttributes>): Promise<T | null> {
    if (!id) throw new Error('ID must be provided');
    return this.model.findByPk(id, options);
  }

  /**
   * Create a new instance of the model.
   * @param data - The data for the new instance.
   * @returns A promise that resolves to the created instance.
   */
  public async create(data: TCreationAttributes): Promise<T> {
    if (!data) throw new Error('Data must be provided');
    return this.model.create(data as unknown as MakeNullishOptional<T['_creationAttributes']>);
  }

  /**
   * Update an existing instance of the model.
   * @param id - The primary key of the instance to update.
   * @param data - The data to update the instance with.
   * @returns A promise that resolves to the updated instance if found, or null if not.
   */
  public async update(id: number, data: Partial<TAttributes>): Promise<T | null> {
    if (!id) throw new Error('ID must be provided');
    if (!data) throw new Error('Data must be provided');

    const instance = await this.model.findByPk(id);
    if (!instance) return null;

    await instance.update(data as TAttributes);
    return instance;
  }

  /**
   * Delete an existing instance of the model.
   * @param id - The primary key of the instance to delete.
   * @returns A promise that resolves to true if the instance was deleted, or false if not.
   */
  public async delete(id: number): Promise<boolean> {
    if (!id) throw new Error('ID must be provided');

    const instance = await this.model.findByPk(id);
    if (!instance) return false;

    await instance.destroy();
    return true;
  }

  /**
   * Find all instances of the model with options.
   * @param options - Options for the query.
   * @returns A promise that resolves to an array of instances.
   */
  public async findAll(options?: FindOptions<TAttributes>): Promise<T[]> {
    return this.model.findAll(options);
  }

  /**
   * Find an instance of the model by its primary key.
   * @param id - The primary key of the instance.
   * @param options - Options for the query.
   * @returns A promise that resolves to the instance if found, or null if not.
   */
  public async findByPk(id: number, options?: FindOptions<TAttributes>): Promise<T | null> {
    if (!id) throw new Error('ID must be provided');
    return this.model.findByPk(id, options);
  }
}