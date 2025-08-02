import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { Subscription, SubscriptionDocument } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User, UserDocument } from '../user/entities/user.entity';

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectModel(Subscription.name)
        private readonly subscriptionModel: Model<SubscriptionDocument>,

        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async create(dto: CreateSubscriptionDto): Promise<Subscription> {
        // Validate ObjectId format
        if (!Types.ObjectId.isValid(dto.userId)) {
            throw new BadRequestException('Invalid user ID format');
        }
        
        const user = await this.userModel.findById(dto.userId).exec();
        if (!user) throw new NotFoundException('User not found');

        const subscription = new this.subscriptionModel({
            user: dto.userId,
            startDate: dto.startDate,
            endDate: dto.endDate,
        });

        const savedSubscription = await subscription.save();
        
        // ✅ Add subscription to user's subscriptions array
        await this.userModel.findByIdAndUpdate(
            dto.userId,
            { $push: { subscriptions: savedSubscription._id } },
            { new: true }
        ).exec();

        return savedSubscription;
    }

    // Simplified findAll without notification logic
    async findAll(): Promise<Subscription[]> {
        return this.subscriptionModel.find().populate('user').exec();
    }

    async findOne(id: string): Promise<Subscription> {
        const subscription = await this.subscriptionModel.findById(id).exec();
        if (!subscription) {
            throw new NotFoundException('Subscription not found');
        }
        return subscription;
    }

    async update(id: string, dto: UpdateSubscriptionDto): Promise<Subscription> {
        const subscription = await this.subscriptionModel.findByIdAndUpdate(id, dto, { new: true }).exec();
        if (!subscription) throw new NotFoundException('Subscription not found');
        return subscription;
    }

    async remove(id: string): Promise<Subscription> {
        const subscription = await this.subscriptionModel.findByIdAndDelete(id).exec();
        if (!subscription) throw new NotFoundException('Subscription not found');
        return subscription;
    }

    // Optional: Keep this if you want scheduled checks without notifications
    @Cron(CronExpression.EVERY_DAY_AT_9AM)
    async checkExpiringSubscriptions() {
        try {
            const all = await this.subscriptionModel.find().populate('user').exec();
            const today = new Date();
            const threshold = new Date();
            threshold.setDate(today.getDate() + 3);

            for (const sub of all) {
                const endDate = new Date(sub.endDate);
                if (endDate >= today && endDate <= threshold) {
                    // Log expiring subscriptions instead of creating notifications
                    console.log(`Subscription expiring soon: ${(sub.user as any).email} - ${sub.endDate}`);
                }
            }
        } catch (error) {
            console.error('[Scheduled subscription check failed]', error);
        }
    }
}
