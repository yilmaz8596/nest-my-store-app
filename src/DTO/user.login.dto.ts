import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserLoginDTO {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  role?: string;
}
