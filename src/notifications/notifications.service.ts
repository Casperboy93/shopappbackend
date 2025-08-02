import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async create(dto: CreateNotificationDto) {
    const notification = new this.notificationModel(dto);
    return notification.save();
  }

  async countByType(): Promise<Record<string, number>> {
    const all = await this.notificationModel.find().exec();
    const result: Record<string, number> = {};
  
    for (const notif of all) {
      result[notif.type] = (result[notif.type] || 0) + 1;
    }
  
    return result;
  }

  async findAll() {
    return this.notificationModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    return this.notificationModel.findById(id).exec();
  }

  async update(id: string, dto: UpdateNotificationDto) {
    const notification = await this.notificationModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async remove(id: string) {
    const notification = await this.notificationModel.findByIdAndDelete(id).exec();
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }
}
