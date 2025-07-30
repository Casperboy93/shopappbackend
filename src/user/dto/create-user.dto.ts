import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole, UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  dob?: Date;

  @IsOptional()
  city?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  profileImg?: string;

  @IsOptional()
  portfolio?: string;

  @IsOptional()
  job?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
