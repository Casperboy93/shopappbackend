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

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.status !== UserStatus.ACTIVE) throw new UnauthorizedException('Account not approved yet');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(dto: RegisterDto) {
    // Check for existing email in Users
    try {
      await this.userService.findByEmail(dto.email);
      throw new BadRequestException('Email already registered');
    } catch (e) {
      // continue if not found
    }

    // Check for existing email in pending requests
    const requests = await this.requestService.findAll();
    if (requests.some(r => r.email === dto.email)) {
      throw new BadRequestException('Email already in registration requests');
    }

    return this.requestService.create(dto);
  }
}
