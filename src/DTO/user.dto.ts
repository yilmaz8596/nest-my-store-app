import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UserDTO {
  @IsOptional()
  id?: number;

  @MinLength(3, { message: 'Full name must be at least 3 characters long' })
  fullName: string;

  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsOptional()
  role?: string;
}
