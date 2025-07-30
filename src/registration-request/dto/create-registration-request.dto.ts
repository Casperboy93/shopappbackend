import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateRegistrationRequestDto {
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
}
