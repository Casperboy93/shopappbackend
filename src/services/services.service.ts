import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  create(dto: CreateServiceDto) {
    const service = this.serviceRepo.create(dto);
    return this.serviceRepo.save(service);
  }

  findAll() {
    return this.serviceRepo.find();
  }

  findOne(id: number) {
    return this.serviceRepo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateServiceDto) {
    const service = await this.serviceRepo.findOneBy({ id });
    if (!service) throw new NotFoundException('Service not found');

    Object.assign(service, dto);
    return this.serviceRepo.save(service);
  }

  async remove(id: number) {
    const service = await this.serviceRepo.findOneBy({ id });
    if (!service) throw new NotFoundException('Service not found');

    await this.serviceRepo.remove(service);
  }
}
