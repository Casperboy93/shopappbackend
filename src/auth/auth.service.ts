import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '../user/entities/user.entity';
import { RegistrationRequestService } from '../registration-request/registration-request.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly requestService: RegistrationRequestService,
  ) {}

  async validateUser(phone: string, password: string) {
    const user = await this.userService.findByPhone(phone);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.status !== UserStatus.ACTIVE) throw new UnauthorizedException('Account not approved yet');

    if (user.password && password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.phone, dto.password);
    const payload = { sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(dto: RegisterDto) {
    // Check for existing phone in Users
    try {
      await this.userService.findByPhone(dto.phone);
      throw new BadRequestException('Phone number already registered');
    } catch (e) {
      // continue if not found
    }

    // Check for existing phone in pending requests
    const requests = await this.requestService.findAll();
    if (requests.some(r => r.phone === dto.phone)) {
      throw new BadRequestException('Phone number already in registration requests');
    }

    return this.requestService.create(dto);
  }
}
