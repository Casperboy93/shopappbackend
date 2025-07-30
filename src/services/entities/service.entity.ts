import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceName: string;

  @Column('float')
  pricing: number;

  @Column('text')
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('text', { array: true })
  serviceImgs: string[];

  @Column()
  deliveryTime: string;

  @Column('text', { array: true })
  citiesCovered: string[];
}
