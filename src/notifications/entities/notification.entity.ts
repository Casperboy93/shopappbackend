import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum NotificationType {
  REGISTRATION = 'REGISTRATION',
  SUPPORT = 'SUPPORT',
  SUBSCRIPTION = 'SUBSCRIPTION',
  ENDING_SOON = 'ENDING_SOON',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
