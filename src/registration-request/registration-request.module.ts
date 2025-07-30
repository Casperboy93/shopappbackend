import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationRequest } from './registration-request.entity';
import { RegistrationRequestService } from './registration-request.service';
import { RegistrationRequestController } from './registration-request.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([RegistrationRequest]), UserModule, NotificationsModule],
  providers: [RegistrationRequestService],
  controllers: [RegistrationRequestController],
  exports: [RegistrationRequestService],
})
export class RegistrationRequestModule { }
