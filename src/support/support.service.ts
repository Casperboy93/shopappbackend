import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SupportMessage, SupportMessageDocument } from './entities/support-message.entity';
import { CreateSupportMessageDto } from './dto/create-support-message.dto';
import { UpdateSupportMessageDto } from './dto/update-support-message.dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(SupportMessage.name)
    private readonly supportModel: Model<SupportMessageDocument>,
  ) {}

  async create(dto: CreateSupportMessageDto) {
    const message = new this.supportModel(dto);
    const saved = await message.save();
    
    // Log instead of creating notification
    console.log(`New support message from ${saved.fullName}: "${saved.title}"`);
    
    return saved;
  }

  async findAll() {
    return this.supportModel.find().exec();
  }

  async findOne(id: string) {
    return this.supportModel.findById(id).exec();
  }

  async update(id: string, dto: UpdateSupportMessageDto) {
    const message = await this.supportModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  async remove(id: string) {
    const message = await this.supportModel.findByIdAndDelete(id).exec();
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }
}
