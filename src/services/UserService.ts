// src/services/UserService.ts

import { BaseService } from './BaseService';
import UserRepository from '../repositories/UserRepository';
import User, { UserAttributes, UserCreationAttributes } from '../models/user/User';

class UserService extends BaseService<User, UserAttributes, UserCreationAttributes> {
  constructor() {
    super(UserRepository);
  }

  // Override create method to add custom logic
  public async create(data: UserCreationAttributes): Promise<User> {
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('A user with this email already exists.');
    }
    return super.create(data);
  }

  // Add user-specific methods
  public async findUserByEmail(email: string): Promise<User | null> {
    return UserRepository.findByEmail(email);
  }
}

export default new UserService();
