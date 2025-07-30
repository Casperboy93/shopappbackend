import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  create(dto: CreateNotificationDto) {
    const notification = this.notificationRepo.create(dto);
    return this.notificationRepo.save(notification);
  }

  async countByType(): Promise<Record<string, number>> {
    const all = await this.notificationRepo.find();
    const result: Record<string, number> = {};
  
    for (const notif of all) {
      result[notif.type] = (result[notif.type] || 0) + 1;
    }
  
    return result;
  }

  findAll() {
    return this.notificationRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.notificationRepo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateNotificationDto) {
    const notification = await this.notificationRepo.findOneBy({ id });
    if (!notification) throw new NotFoundException('Notification not found');

    Object.assign(notification, dto);
    return this.notificationRepo.save(notification);
  }

  async remove(id: number) {
    const notification = await this.notificationRepo.findOneBy({ id });
    if (!notification) throw new NotFoundException('Notification not found');

    await this.notificationRepo.remove(notification);
  }
}
