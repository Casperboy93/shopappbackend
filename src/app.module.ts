import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { RegistrationRequestModule } from './registration-request/registration-request.module';
import { UserModule } from './user/user.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SupportModule } from './support/support.module';
import { ServicesModule } from './services/services.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_URL'),
        retryWrites: true,
        w: 'majority',
        serverSelectionTimeoutMS: 30000, // Increased from 10000
        socketTimeoutMS: 60000, // Increased from 45000
        connectTimeoutMS: 30000, // Added
        maxPoolSize: 10, // Added
        minPoolSize: 1, // Added
        maxIdleTimeMS: 30000, // Added
        bufferCommands: false,
        bufferMaxEntries: 0, // Added
        authSource: 'admin', // Added
      }),
    }),
    
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    RegistrationRequestModule,
    SubscriptionsModule,
    SupportModule,
    ServicesModule,
    // Removed NotificationsModule
  ],
})
export class AppModule {}
