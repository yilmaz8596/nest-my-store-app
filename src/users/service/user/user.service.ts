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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

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

  async findUserByEmailWithPassword(email: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
