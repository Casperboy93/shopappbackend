import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  phone: string;

  @IsString()
  @MinLength(5)
  password: string;
}
