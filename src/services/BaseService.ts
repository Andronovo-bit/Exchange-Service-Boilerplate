// src/services/BaseService.ts

import { GenericRepository } from '../repositories/generic/GenericRepository';
import { Model, FindOptions } from 'sequelize';
import 'reflect-metadata';
import { injectable } from 'inversify';
import { NotFoundError } from '../utils/errors';

@injectable()
export abstract class BaseService<
  T extends Model<TAttributes, TCreationAttributes>,
  TAttributes extends object,
  TCreationAttributes extends object,
> {
  protected readonly repository: GenericRepository<T, TAttributes, TCreationAttributes>;

  constructor(repository: GenericRepository<T, TAttributes, TCreationAttributes>) {
    this.repository = repository;
  }

  /**
   * Get all instances of the model.
   * @param options - Options for the query.
   * @returns A promise that resolves to an array of instances.
   */
  public async getAll(options?: FindOptions<TAttributes>): Promise<T[]> {
    return this.repository.getAll(options);
  }

  /**
   * Get an instance of the model by its primary key.
   * @param id - The primary key of the instance.
   * @param options - Options for the query.
   * @returns A promise that resolves to the instance if found, or null if not.
   */
  public async getById(id: number, options?: FindOptions<TAttributes>): Promise<T | null> {
    if (!id) throw new Error('ID must be provided');
    return this.repository.getById(id, options);
  }

  /**
   * Create a new instance of the model.
   * @param data - The data for the new instance.
   * @returns A promise that resolves to the created instance.
   */
  public async create(data: TCreationAttributes): Promise<T> {
    if (!data) throw new Error('Data must be provided');
    return this.repository.create(data);
  }

  /**
   * Update an existing instance of the model.
   * @param id - The primary key of the instance to update.
   * @param data - The data to update the instance with.
   * @returns A promise that resolves to the updated instance if found, or null if not.
   */
  public async update(id: number, data: Partial<TAttributes>): Promise<T | null> {
    if (!id) throw new Error('ID must be provided');
    const instance = await this.repository.getById(id);
    if (!instance) throw new NotFoundError('Instance not found: ' + typeof instance);
    if (!data) throw new Error('Data must be provided');
    return this.repository.update(id, data);
  }

  /**
   * Delete an existing instance of the model.
   * @param id - The primary key of the instance to delete.
   * @returns A promise that resolves to true if the instance was deleted, or false if not.
   */
  public async delete(id: number): Promise<boolean> {
    if (!id) throw new Error('ID must be provided');
    const instance = await this.repository.getById(id);
    if (!instance) throw new NotFoundError('Instance not found: ' + typeof instance);
    return this.repository.delete(id);
  }

  /**
   * Find all instances of the model with options.
   * @param options - Options for the query.
   * @returns A promise that resolves to an array of instances.
   */
  public async findAll(options?: FindOptions<TAttributes>): Promise<T[]> {
    return this.repository.findAll(options);
  }

  /**
   * Find an instance of the model by its primary key.
   * @param id - The primary key of the instance.
   * @param options - Options for the query.
   * @returns A promise that resolves to the instance if found, or null if not.
   */
  public async findById(id: number, options?: FindOptions<TAttributes>): Promise<T | null> {
    if (!id) throw new Error('ID must be provided');
    return this.repository.findByPk(id, options);
  }
}