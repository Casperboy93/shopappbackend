import { IsString, IsEmail } from 'class-validator';

export class CreateSupportMessageDto {
  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  title: string;

  @IsString()
  message: string;
}
