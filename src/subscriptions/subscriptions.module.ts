import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { Subscription } from './entities/subscription.entity';
import { User } from '../user/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';


@Module({
  imports: [TypeOrmModule.forFeature([Subscription, User]), NotificationsModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
