import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export enum UserStatus {
  ACTIVE = 'active',
  NOT_APPROVED = 'notapproved',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column({ nullable: true })
  phone: string;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  dob: Date;

  @ApiProperty()
  @Column({ nullable: true })
  city: string;

  @ApiProperty()
  @Column({ nullable: true })
  address: string;

  @ApiProperty()
  @Column({ nullable: true })
  profileImg: string;

  @ApiProperty()
  @Column({ nullable: true })
  portfolio: string;

  @ApiProperty()
  @Column({ nullable: true })
  job: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty()
  @Column({ default: 0 })
  views: number;

  @ApiProperty()
  @Column({ default: 0 })
  phoneViews: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  rating: number;

  @ApiProperty({ enum: UserRole })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty({ enum: UserStatus })
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.NOT_APPROVED })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

}
