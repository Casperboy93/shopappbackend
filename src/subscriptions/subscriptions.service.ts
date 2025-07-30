import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from '../user/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';


@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionRepo: Repository<Subscription>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly notificationsService: NotificationsService,
    ) { }

    async create(dto: CreateSubscriptionDto): Promise<Subscription> {
        const user = await this.userRepo.findOne({ where: { id: dto.userId } });
        if (!user) throw new NotFoundException('User not found');
      
        const subscription = this.subscriptionRepo.create({
          user,
          startDate: dto.startDate,
          endDate: dto.endDate,
        });
      
        return this.subscriptionRepo.save(subscription);
      }
      


      async findAll(): Promise<Subscription[]> {
        const all = await this.subscriptionRepo.find({ relations: ['user'] });
      
        const today = new Date();
        const threshold = new Date();
        threshold.setDate(today.getDate() + 3);
      
        for (const sub of all) {
          const endDate = new Date(sub.endDate);
          if (endDate >= today && endDate <= threshold) {
            // Check if notification already exists (optional optimization)
            await this.notificationsService.create({
              title: 'Subscription Ending Soon',
              message: `Subscription for ${sub.user.email} ends on ${sub.endDate}.`,
              type: NotificationType.ENDING_SOON,
            });
          }
        }
      
        return all;
      }
      


    async findOne(id: number): Promise<Subscription> {
        const subscription = await this.subscriptionRepo.findOne({ where: { id } });
        if (!subscription) {
            throw new NotFoundException('Subscription not found');
        }
        return subscription;
    }


    async update(id: number, dto: UpdateSubscriptionDto): Promise<Subscription> {
        const subscription = await this.subscriptionRepo.findOne({ where: { id } });
        if (!subscription) throw new NotFoundException('Subscription not found');

        Object.assign(subscription, dto);
        return this.subscriptionRepo.save(subscription);
    }

    async remove(id: number): Promise<void> {
        const subscription = await this.subscriptionRepo.findOne({ where: { id } });
        if (!subscription) throw new NotFoundException('Subscription not found');

        await this.subscriptionRepo.remove(subscription);
    }


    async notifyEndingSoon() {
        const today = new Date();
        today.setDate(today.getDate() + 3);
      
        const start = new Date(today);
        start.setHours(0, 0, 0, 0);
      
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);
      
        const expiring = await this.subscriptionRepo
          .createQueryBuilder('s')
          .leftJoinAndSelect('s.user', 'user')
          .where('s.endDate BETWEEN :start AND :end', { start, end })
          .getMany();
      
        for (const sub of expiring) {
          await this.notificationsService.create({
            title: 'Subscription Ending Soon',
            message: `Subscription for ${sub.user.email} ends on ${sub.endDate}.`,
            type: NotificationType.ENDING_SOON,
          });
        }
      }
      


    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    handleCron() {
        this.notifyEndingSoon();
    }
}
