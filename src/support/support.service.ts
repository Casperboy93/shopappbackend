import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';
import { SupportMessage } from './entities/support-message.entity';
import { CreateSupportMessageDto } from './dto/create-support-message.dto';
import { UpdateSupportMessageDto } from './dto/update-support-message.dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportMessage)
    private readonly supportRepo: Repository<SupportMessage>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateSupportMessageDto) {
    const message = this.supportRepo.create(dto);
    const saved = await this.supportRepo.save(message);

    // 🛎 Create notification on new support message
    await this.notificationsService.create({
      title: 'New Support Message',
      message: `From ${saved.fullName}: "${saved.title}"`,
      type: NotificationType.SUPPORT,
    });

    return saved;
  }

  findAll() {
    return this.supportRepo.find();
  }

  findOne(id: number) {
    return this.supportRepo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateSupportMessageDto) {
    const message = await this.supportRepo.findOneBy({ id });
    if (!message) throw new NotFoundException('Message not found');

    Object.assign(message, dto);
    return this.supportRepo.save(message);
  }

  async remove(id: number) {
    const message = await this.supportRepo.findOneBy({ id });
    if (!message) throw new NotFoundException('Message not found');

    await this.supportRepo.remove(message);
  }
}
