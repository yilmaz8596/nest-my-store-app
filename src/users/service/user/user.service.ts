import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../entities/user';
import { UserDTO } from '../../../DTO/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<UserDTO>,
  ) {}

  async createUser(user: UserDTO) {
    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findUserByEmail(
    email: string,
  ): Promise<Omit<UserDTO, 'password'> | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  }

  // Method to find user by ID without password
  async findUserById(
    userId: number,
  ): Promise<Omit<UserDTO, 'password'> | null> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  }

  // Method to find user with password for authentication
  async findUserByEmailWithPassword(email: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  // Method to verify password
  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
