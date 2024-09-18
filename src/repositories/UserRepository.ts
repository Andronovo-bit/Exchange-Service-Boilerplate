// src/repositories/UserRepository.ts

import { GenericRepository } from './generic/GenericRepository';
import User, { UserAttributes, UserCreationAttributes } from '../models/user/User';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Sequelize } from 'sequelize';

@injectable()
class UserRepository extends GenericRepository<User, UserAttributes, UserCreationAttributes> {
  constructor(
    @inject('SequelizeInstance') private sequelizeInstance: Sequelize
  ) {
    super(User);
  }

  // Add any user-specific methods here
  async findByEmail(email: string): Promise<User | null> {
    return await this.model.findOne({ where: { email } });
  }
}

export default UserRepository;