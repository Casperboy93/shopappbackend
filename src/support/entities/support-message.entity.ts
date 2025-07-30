import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class SupportMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
