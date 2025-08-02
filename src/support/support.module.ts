import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { SupportMessage, SupportMessageSchema } from './entities/support-message.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: SupportMessage.name, schema: SupportMessageSchema }])],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}