import { config } from 'dotenv';
config();
import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { getConnectionToken } from '@nestjs/mongoose';
import { User, UserRole, UserStatus, UserSchema } from '../user/entities/user.entity';
import { Service, ServiceSchema } from '../services/entities/service.entity';
import { Subscription, SubscriptionSchema } from '../subscriptions/entities/subscription.entity';
import { Connection } from 'mongoose';

export async function seedAdminAndData(app: INestApplication) {
  try {
    console.log('✅ Using existing MongoDB connection');

    const connection = app.get<Connection>(getConnectionToken());
    const UserModel = connection.model('User', UserSchema);
    const ServiceModel = connection.model('Service', ServiceSchema);
    const SubscriptionModel = connection.model('Subscription', SubscriptionSchema);

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
        city: 'Admin City',
        address: 'Admin HQ',
        job: 'Administrator',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      });
      console.log('✅ Admin created');
    } else {
      console.log('ℹ️ Admin already exists');
    }

    // Create 20 test users with different jobs and cities
    const cities = ['Casablanca', 'Rabat', 'Fes', 'Marrakech', 'Tangier', 'Agadir', 'Meknes', 'Oujda'];
    const jobs = [
      'Software Engineer', 'Teacher', 'Doctor', 'Lawyer', 'Designer', 
      'Accountant', 'Chef', 'Photographer', 'Writer', 'Architect',
      'Marketing Specialist', 'Nurse', 'Engineer', 'Consultant', 'Artist',
      'Translator', 'Mechanic', 'Electrician', 'Plumber', 'Carpenter'
    ];
    
    const createdUsers: any[] = []; // Fix: Properly type the array
    
    for (let i = 1; i <= 20; i++) {
      const email = `user${i}@test.com`;
      const existing = await UserModel.findOne({ email });
      if (!existing) {
        const user = await UserModel.create({
          firstName: `User${i}`,
          lastName: 'Test',
          email,
          password: await bcrypt.hash('password123', 10),
          phone: `06000000${i.toString().padStart(2, '0')}`,
          dob: new Date('1995-01-01'),
          city: cities[i % cities.length],
          address: `${i * 10} Street`,
          job: jobs[i - 1],
          description: `Professional ${jobs[i - 1]} with extensive experience in ${cities[i % cities.length]}. Providing high-quality services to clients.`,
          status: UserStatus.ACTIVE,
          profileImg: `https://i.pravatar.cc/300?img=${i}`,
        });
        createdUsers.push(user);
      } else {
        createdUsers.push(existing);
      }
    }
    console.log('✅ 20 users created with different jobs and cities');

    // Create subscriptions for 10 random users with durations between 2-20 days
    const usersToSubscribe = createdUsers.slice(0, 10); // Take first 10 users
    
    for (let i = 0; i < usersToSubscribe.length; i++) {
      const user = usersToSubscribe[i];
      
      // Check if subscription already exists for this user
      const existingSubscription = await SubscriptionModel.findOne({ user: user._id });
      if (!existingSubscription) {
        // Generate random duration between 2-20 days
        const randomDuration = Math.floor(Math.random() * 19) + 2; // 2-20 days
        
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + randomDuration);
        
        const subscription = await SubscriptionModel.create({
          user: user._id,
          startDate: startDate,
          endDate: endDate,
        });
        
        // Add subscription to user's subscriptions array
        await UserModel.findByIdAndUpdate(
          user._id,
          { $push: { subscriptions: subscription._id } },
          { new: true }
        );
        
        console.log(`✅ Subscription created for ${user.firstName} ${user.lastName} (${randomDuration} days)`);
      }
    }
    console.log('✅ 10 users subscribed with random durations (2-20 days)');

    // Create 6 services in different cities
    const serviceCities = ['Casablanca', 'Rabat', 'Fes', 'Marrakech', 'Tangier', 'Agadir'];
    const serviceNames = ['Web Development', 'Graphic Design', 'Digital Marketing', 'Photography', 'Translation', 'Consulting'];
    
    for (let i = 1; i <= 6; i++) {
      const existingService = await ServiceModel.findOne({ serviceName: serviceNames[i - 1] });
      if (!existingService) {
        await ServiceModel.create({
          serviceName: serviceNames[i - 1],
          pricing: 100 + i * 50,
          description: `Professional ${serviceNames[i - 1].toLowerCase()} services in ${serviceCities[i - 1]}`,
          serviceImgs: [
            `https://picsum.photos/seed/service${i}a/300/200`,
            `https://picsum.photos/seed/service${i}b/300/200`,
          ],
          deliveryTime: `${i + 2} days`,
          citiesCovered: [serviceCities[i - 1]],
        });
      }
    }
    console.log('✅ 6 services created in different cities');

    console.log('✅ Seed completed successfully');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

// Seed is now called from main.ts with app context
