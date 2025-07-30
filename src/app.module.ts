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
        url : process.env.DATABASE_URL,
        host: config.get('DB_HOST'),
        port: +config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [User, RegistrationRequest, Subscription, SupportMessage, Service, Notification],
        synchronize: true, // set to false in production!
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
