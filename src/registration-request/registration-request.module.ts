import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrationRequest, RegistrationRequestSchema } from './registration-request.entity';
import { RegistrationRequestService } from './registration-request.service';
import { RegistrationRequestController } from './registration-request.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: RegistrationRequest.name, schema: RegistrationRequestSchema }]), UserModule],
  providers: [RegistrationRequestService],
  controllers: [RegistrationRequestController],
  exports: [RegistrationRequestService],
})
export class RegistrationRequestModule { }