import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
  _id?: any; // Mongoose auto-generated _id

  @ApiProperty()
  @Prop({ required: true })
  serviceName: string;

  @ApiProperty()
  @Prop({ required: true, type: Number })
  pricing: number;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @ApiProperty()
  @Prop({ type: [String], required: true })
  serviceImgs: string[];

  @ApiProperty()
  @Prop({ required: true })
  deliveryTime: string;

  @ApiProperty()
  @Prop({ type: [String], required: true })
  citiesCovered: string[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
