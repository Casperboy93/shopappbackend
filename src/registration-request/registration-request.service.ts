import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RegistrationRequest,
  RegistrationRequestDocument,
  RegistrationRequestStatus,
} from './registration-request.entity';
import { CreateRegistrationRequestDto } from './dto/create-registration-request.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { UserRole, UserStatus } from '../user/entities/user.entity';

@Injectable()
export class RegistrationRequestService {
  constructor(
    @InjectModel(RegistrationRequest.name)
    private requestModel: Model<RegistrationRequestDocument>,
    private userService: UserService,
  ) {}

  async create(data: CreateRegistrationRequestDto) {
    // Check if phone already exists in registration requests
    const existingRequest = await this.requestModel
      .findOne({ phone: data.phone })
      .exec();
    if (existingRequest) {
      throw new ConflictException(
        'Phone number already exists in pending requests',
      );
    }

    // Check if phone already exists in users
    const existingUser = await this.userService.findByPhone(data.phone);
    if (existingUser) {
      throw new ConflictException('Phone number already registered');
    }

    try {
      const hash = data.password
        ? await bcrypt.hash(data.password, 10)
        : undefined;

      const savedRequest = await this.requestModel.create({
        ...data,
        password: hash,
      });

      // Log instead of creating notification
      console.log(`New registration request from ${savedRequest.firstName} ${savedRequest.lastName}`);

      return savedRequest;
    } catch (error) {
      console.error('[Registration Create Error]', error);

      if (error.code === 11000) {
        throw new ConflictException('Phone number already exists');
      }

      throw error;
    }
  }

  async findAll() {
    return this.requestModel.find().exec();
  }

  async findOne(id: string) {
    const req = await this.requestModel.findById(id).exec();
    if (!req) throw new NotFoundException('Registration request not found');
    return req;
  }

  async approve(id: string) {
    const req = await this.findOne(id);

    await this.requestModel.updateOne(
      { _id: req._id },
      { status: RegistrationRequestStatus.APPROVED },
    );

    await this.userService.create({
      firstName: req.firstName,
      lastName: req.lastName,
      email: req.email || undefined,
      password: req.password || undefined,
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

    return { ...req.toObject(), status: RegistrationRequestStatus.APPROVED };
  }

  async reject(id: string) {
    const req = await this.findOne(id);

    await this.requestModel.updateOne(
      { _id: req._id },
      { status: RegistrationRequestStatus.REJECTED },
    );

    return { ...req.toObject(), status: RegistrationRequestStatus.REJECTED };
  }
}
