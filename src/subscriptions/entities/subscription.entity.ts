import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true })
export class Subscription {
  _id?: any; // Mongoose auto-generated _id (removed @Prop decorator)

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, type: Date })
  startDate: Date;

  @ApiProperty()
  @Prop({ required: true, type: Date })
  endDate: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
