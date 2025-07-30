import { IsString, IsNumber, IsArray, ArrayMaxSize } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  serviceName: string;

  @IsNumber()
  pricing: number;

  @IsString()
  description: string;

  @IsArray()
  @ArrayMaxSize(6)
  @IsString({ each: true })
  serviceImgs: string[];

  @IsString()
  deliveryTime: string;

  @IsArray()
  @ArrayMaxSize(6)
  @IsString({ each: true })
  citiesCovered: string[];
}
