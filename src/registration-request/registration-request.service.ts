import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';
import { RegistrationRequest, RegistrationRequestStatus } from './registration-request.entity';
import { CreateRegistrationRequestDto } from './dto/create-registration-request.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { UserRole, UserStatus } from '../user/entities/user.entity';

@Injectable()
export class RegistrationRequestService {
  constructor(
    @InjectRepository(RegistrationRequest)
    private requestRepo: Repository<RegistrationRequest>,
    private userService: UserService,
    private notificationsService: NotificationsService,
  ) {}

  async create(data: CreateRegistrationRequestDto) {
    const hash = await bcrypt.hash(data.password, 10);
    const request = this.requestRepo.create({ ...data, password: hash });
    const savedRequest = await this.requestRepo.save(request);
  
    // 📌 CREATE NOTIFICATION HERE
    await this.notificationsService.create({
      title: 'New Registration Request',
      message: `New registration request from ${savedRequest.firstName} ${savedRequest.lastName}.`,
      type: NotificationType.REGISTRATION,
    });
  
    return savedRequest;
  }
  
  async findAll() {
    return this.requestRepo.find();
  }

  async findOne(id: number) {
    const req = await this.requestRepo.findOneBy({ id });
    if (!req) throw new NotFoundException('Registration request not found');
    return req;
  }

  async approve(id: number) {
    const req = await this.findOne(id);
    req.status = RegistrationRequestStatus.APPROVED;
    await this.requestRepo.save(req);

    await this.userService.create({
      firstName: req.firstName,
      lastName: req.lastName,
      email: req.email,
      password: req.password,
      phone: req.phone,
      dob: req.dob,
      city: req.city,
      address: req.address,
      profileImg: req.profileImg,
      portfolio: req.portfolio,
      job: req.job,
      description: req.description,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    });

    return req;
  }

  async reject(id: number) {
    const req = await this.findOne(id);
    req.status = RegistrationRequestStatus.REJECTED;
    return this.requestRepo.save(req);
  }
}
