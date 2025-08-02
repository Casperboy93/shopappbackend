import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum RegistrationRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NOT_APPROVED = 'notapproved',
}

export type RegistrationRequestDocument = RegistrationRequest & Document;

@Schema({ timestamps: true })
export class RegistrationRequest {
  @ApiProperty()
  @Prop({ required: true })
  firstName: string;

  @ApiProperty()
  @Prop({ required: true })
  lastName: string;

  @ApiProperty()
  @Prop({ required: false })
  email?: string;

  @ApiProperty()
  @Prop({ required: false })
  password?: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  phone: string;

  @ApiProperty()
  @Prop({ type: Date, required: false })
  dob?: Date;

  @ApiProperty()
  @Prop({ required: false })
  city?: string;

  @ApiProperty()
  @Prop({ required: false })
  address?: string;

  @ApiProperty()
  @Prop({ required: false })
  profileImg?: string;

  @ApiProperty()
  @Prop({ required: false })
  portfolio?: string;

  @ApiProperty()
  @Prop({ required: false })
  job?: string;

  @ApiProperty()
  @Prop({ required: false })
  description?: string;

  @ApiProperty({ enum: RegistrationRequestStatus })
  @Prop({ type: String, enum: RegistrationRequestStatus, default: RegistrationRequestStatus.PENDING })
  status: RegistrationRequestStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

export const RegistrationRequestSchema = SchemaFactory.createForClass(RegistrationRequest);
