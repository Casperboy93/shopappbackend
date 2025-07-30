import { IsDateString, IsInt, IsPositive } from 'class-validator';

export class CreateSubscriptionDto {
  @IsInt()
  userId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
