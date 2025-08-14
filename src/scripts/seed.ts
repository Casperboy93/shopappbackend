import { config } from 'dotenv';
config();
import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { getConnectionToken } from '@nestjs/mongoose';
import { User, UserRole, UserStatus, UserSchema } from '../user/entities/user.entity';
import { Connection, Document } from 'mongoose';

// Add proper type for User document
type UserDocument = Document & User & { _id: any };

export async function seedAdminAndData(app: INestApplication) {
  try {
    console.log('✅ Using existing MongoDB connection');

    const connection = app.get<Connection>(getConnectionToken());
    const UserModel = connection.model('User', UserSchema);

    // Create admin user
    const existingAdmin = await UserModel.findOne({ email: 'admin@test.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await UserModel.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@test.com',
        password: hashedPassword,
        phone: '0000000000',
        dob: new Date('1990-01-01'),
        city: 'Casablanca',
        address: 'Admin HQ',
        job: 'Administrator',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      });
      console.log('✅ Admin created successfully');
    } else {
      console.log('ℹ️ Admin already exists');
    }

    console.log('✅ Seed completed - Admin user ready');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

// Seed is now called from main.ts with app context
