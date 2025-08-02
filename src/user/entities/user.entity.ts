import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export enum UserStatus {
  ACTIVE = 'active',
  NOT_APPROVED = 'notapproved',
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id?: any; // Mongoose auto-generated _id

  @ApiProperty()
  @Prop({ required: true })
  firstName: string;

  @ApiProperty()
  @Prop({ required: true })
  lastName: string;

  @ApiProperty()
  @Prop()
  @ApiProperty()
  @Prop({ unique: true })
  email?: string;

  @ApiProperty()
  @Prop()
  password?: string;

  @ApiProperty()
  @Prop()
  @ApiProperty()
  @Prop({ unique: true })
  phone?: string;

  @ApiProperty()
  @Prop({ type: Date })
  dob?: Date;

  @ApiProperty()
  @Prop()
  city?: string;

  @ApiProperty()
  @Prop()
  address?: string;

  @ApiProperty()
  @Prop()
  profileImg?: string;

  @ApiProperty()
  @Prop()
  portfolio?: string;

  @ApiProperty()
  @Prop()
  job?: string;

  @ApiProperty()
  @Prop()
  description?: string;

  @ApiProperty()
  @Prop({ default: 0 })
  views: number;

  @ApiProperty()
  @Prop({ default: 0 })
  phoneViews: number;

  @ApiProperty()
  @Prop({ type: Number, default: 0 })
  rating: number;

  @ApiProperty({ enum: UserRole })
  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty({ enum: UserStatus })
  @Prop({ type: String, enum: UserStatus, default: UserStatus.NOT_APPROVED })
  status: UserStatus;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Subscription' }] })
  subscriptions: Types.ObjectId[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
