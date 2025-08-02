import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole, UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsString()
  phone: string;

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
