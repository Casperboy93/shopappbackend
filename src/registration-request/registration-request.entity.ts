import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum RegistrationRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NOT_APPROVED = 'notapproved',
}

@Entity()
export class RegistrationRequest {
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

  @ApiProperty({ enum: RegistrationRequestStatus })
  @Column({ type: 'enum', enum: RegistrationRequestStatus, default: RegistrationRequestStatus.PENDING })
  status: RegistrationRequestStatus;

  @CreateDateColumn()
  createdAt: Date;
}
