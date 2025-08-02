import { IsDateString, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  userId: string;  // Changed from number to string to match MongoDB ObjectId

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
