import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findAllUsersOnly(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: UserRole.USER },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, data);
    return this.findOne(id);
  }

  async incrementViews(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.views++;
    return this.userRepository.save(user);
  }

  async incrementPhoneViews(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.phoneViews++;
    return this.userRepository.save(user);
  }

  async setRating(id: number, rating: number): Promise<User> {
    const user = await this.findOne(id);
    user.rating = rating;
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByPhone(phone: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  


  // user.service.ts
  async getAllSubscribedUsers() {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.subscriptions', 'subscription')
      .where('user.role = :role', { role: UserRole.USER })
      .andWhere('subscription.id IS NOT NULL');

    return qb.getMany();
  }

  
}
