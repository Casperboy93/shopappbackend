import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './entities/user.entity';
import { Subscription, SubscriptionDocument } from '../subscriptions/entities/subscription.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
  ) { }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findAllUsersOnly(): Promise<User[]> {
    return this.userModel.find({ role: UserRole.USER }).exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    const user = new this.userModel(data);
    return user.save();
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async incrementViews(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async incrementPhoneViews(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $inc: { phoneViews: 1 } },
      { new: true }
    ).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async setRating(id: string, rating: number): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { rating },
      { new: true }
    ).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const user = await this.userModel.findOne({ phone }).exec();
    return user; // Returns null if not found, instead of throwing exception
  }
  


  async getAllSubscribedUsers() {
    // Get all active subscriptions
    const activeSubscriptions = await this.subscriptionModel
        .find({
            endDate: { $gte: new Date() } // Only active subscriptions
        })
        .distinct('user')
        .exec();
    
    // Get users who have active subscriptions
    return this.userModel
        .find({
            role: UserRole.USER,
            _id: { $in: activeSubscriptions }
        })
        .exec();
  }
}
