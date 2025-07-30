import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RegistrationRequestService } from './registration-request.service';
import { CreateRegistrationRequestDto } from './dto/create-registration-request.dto'
import { UserRole } from '../user/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiBearerAuth()
@ApiTags('registration-requests')
@Controller('registration-requests')
export class RegistrationRequestController {
  constructor(private readonly service: RegistrationRequestService) {}

  @Post()
  create(@Body() dto: CreateRegistrationRequestDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.service.approve(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post(':id/reject')
  reject(@Param('id') id: string) {
    return this.service.reject(+id);
  }
}
