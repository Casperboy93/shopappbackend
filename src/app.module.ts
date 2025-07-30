import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RegistrationRequestModule } from './registration-request/registration-request.module';
import { RegistrationRequest } from './registration-request/registration-request.entity';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { Subscription } from './subscriptions/entities/subscription.entity';
import { SupportModule } from './support/support.module';
import { ServicesModule } from './services/services.module';
import { SupportMessage } from './support/entities/support-message.entity';
import { Service } from './services/entities/service.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/entities/notification.entity';

import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false, // Required by Supabase
        },
        entities: [User, RegistrationRequest, Subscription, SupportMessage, Service, Notification],
        synchronize: true, // ⚠️ Disable in production
      }),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    RegistrationRequestModule,
    SubscriptionsModule,
    SupportModule,
    ServicesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
