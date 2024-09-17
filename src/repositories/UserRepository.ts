// src/repositories/UserRepository.ts

import { GenericRepository } from './generic/GenericRepository';
import User, { UserAttributes, UserCreationAttributes } from '../models/user/User';
import { injectable } from 'inversify';

@injectable()
class UserRepository extends GenericRepository<User, UserAttributes, UserCreationAttributes> {
  constructor() {
    super(User);
  }

  // Add any user-specific methods here
  async findByEmail(email: string): Promise<User | null> {
    return await this.model.findOne({ where: { email } });
  }
}

export default UserRepository;
