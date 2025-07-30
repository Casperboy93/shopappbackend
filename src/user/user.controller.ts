import { Controller, Get, Param, Patch, Body, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('all-users')
  getUsersOnly() {
    return this.userService.findAllUsersOnly();
  }

  @Get('all-subs')
  @Public()
  async getAllSubscribedUsers() {
    return this.userService.getAllSubscribedUsers();
  }





  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);

    // Only return if role is USER
    if (user?.role !== UserRole.USER) {
      return { statusCode: 404, message: 'User not found' };
    }

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return this.userService.findOne(req.user.id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email); // Must return user with id
  }

  @Get('by-email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@Req() req, @Body() data: UpdateUserDto) {
    return this.userService.update(req.user.id, data);
  }

  @Patch(':id/views')
  incrementViews(@Param('id') id: string) {
    return this.userService.incrementViews(+id);
  }

  @Patch(':id/phoneviews')
  incrementPhoneViews(@Param('id') id: string) {
    return this.userService.incrementPhoneViews(+id);
  }

  @Patch(':id/rating')
  setRating(@Param('id') id: string, @Body('rating') rating: number) {
    return this.userService.setRating(+id, rating);
  }

  @Get('/by-phone/:phone')
findByPhone(@Param('phone') phone: string) {
  return this.userService.findByPhone(phone);
}

}
