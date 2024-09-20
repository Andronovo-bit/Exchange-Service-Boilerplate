// src/services/UserService.ts

import { BaseService } from './BaseService';
import UserRepository from '../repositories/UserRepository';
import User, { UserAttributes, UserCreationAttributes } from '../models/user/User';
import { inject, injectable } from 'inversify';
import { NotFoundError } from '../utils/errors';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateTokens';

@injectable()
class AuthService extends BaseService<User, UserAttributes, UserCreationAttributes> {
  constructor(@inject(UserRepository) private userRepository: UserRepository) {
    super(userRepository);
  }

  public async login(email: string, password: string): Promise<{ token: string; user: UserAttributes }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid email or password');
    }

    const token = await generateToken(user.id);
    return { token, user };
  }

  // register a new user
  public async register(data: UserCreationAttributes): Promise<User> {
    const { email, password, username } = data;

    // Check if the email or username already exists
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new NotFoundError('Email or username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      username,
      balance: 0,
    });

    return newUser;
  }
}

export default AuthService;
