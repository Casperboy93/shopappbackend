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

    // Moroccan cities
    const cities = ['Casablanca', 'Rabat', 'Fes', 'Marrakech', 'Tangier', 'Agadir', 'Meknes', 'Oujda', 'Tetouan', 'Kenitra', 'Sale', 'Temara'];
    
    // Real Moroccan names
    const moroccanNames = [
      { firstName: 'Ahmed', lastName: 'Benali' },
      { firstName: 'Fatima', lastName: 'Zahra' },
      { firstName: 'Mohamed', lastName: 'Alami' },
      { firstName: 'Aicha', lastName: 'Bennani' },
      { firstName: 'Youssef', lastName: 'Idrissi' },
      { firstName: 'Khadija', lastName: 'Tazi' },
      { firstName: 'Omar', lastName: 'Fassi' },
      { firstName: 'Zineb', lastName: 'Chraibi' },
      { firstName: 'Karim', lastName: 'Benjelloun' },
      { firstName: 'Nadia', lastName: 'Lahlou' },
      { firstName: 'Rachid', lastName: 'Berrada' },
      { firstName: 'Samira', lastName: 'Kettani' },
      { firstName: 'Hassan', lastName: 'Tounsi' },
      { firstName: 'Leila', lastName: 'Amrani' },
      { firstName: 'Abdelkader', lastName: 'Zniber' },
      { firstName: 'Malika', lastName: 'Benkirane' },
      { firstName: 'Driss', lastName: 'Guerraoui' },
      { firstName: 'Souad', lastName: 'Filali' },
      { firstName: 'Mustapha', lastName: 'Benabdellah' },
      { firstName: 'Rajae', lastName: 'Mekouar' },
      { firstName: 'Khalid', lastName: 'Benslimane' },
      { firstName: 'Houda', lastName: 'Benali' },
      { firstName: 'Said', lastName: 'Cherkaoui' },
      { firstName: 'Amina', lastName: 'Benomar' },
      { firstName: 'Brahim', lastName: 'Laazizi' },
      { firstName: 'Nezha', lastName: 'Hayat' },
      { firstName: 'Abderrahim', lastName: 'Bouazza' },
      { firstName: 'Latifa', lastName: 'Akhannouch' },
      { firstName: 'Jamal', lastName: 'Eddine' },
      { firstName: 'Widad', lastName: 'Zemmouri' }
    ];
    
    const jobs = [
      'Software Engineer', 'Teacher', 'Doctor', 'Lawyer', 'Designer', 
      'Accountant', 'Chef', 'Photographer', 'Writer', 'Architect',
      'Marketing Specialist', 'Nurse', 'Engineer', 'Consultant', 'Artist',
      'Translator', 'Mechanic', 'Electrician', 'Plumber', 'Carpenter',
      'Pharmacist', 'Dentist', 'Journalist', 'Real Estate Agent', 'Banker',
      'Shop Owner', 'Taxi Driver', 'Hairdresser', 'Tailor', 'Baker'
    ];
    
    const createdUsers: any[] = [];
    
    // Create 30 Moroccan users
    for (let i = 0; i < 30; i++) {
      const name = moroccanNames[i];
      const phone = `06${Math.floor(Math.random() * 90000000 + 10000000)}`; // Random Moroccan phone
      
      const existing = await UserModel.findOne({ phone });
      if (!existing) {
        // Random age between 18-40
        const age = Math.floor(Math.random() * 23) + 18; // 18-40 years
        const birthYear = new Date().getFullYear() - age;
        const birthMonth = Math.floor(Math.random() * 12);
        const birthDay = Math.floor(Math.random() * 28) + 1;
        
        const user = await UserModel.create({
          firstName: name.firstName,
          lastName: name.lastName,
          phone,
          dob: new Date(birthYear, birthMonth, birthDay),
          city: cities[Math.floor(Math.random() * cities.length)],
          address: `${Math.floor(Math.random() * 999) + 1} Rue ${Math.floor(Math.random() * 50) + 1}`,
          job: jobs[Math.floor(Math.random() * jobs.length)],
          description: `Professional ${jobs[Math.floor(Math.random() * jobs.length)].toLowerCase()} providing quality services in Morocco.`,
          status: UserStatus.ACTIVE,
          profileImg: `https://i.pravatar.cc/300?img=${i + 50}`,
        });
        createdUsers.push(user);
      } else {
        createdUsers.push(existing);
      }
    }
    console.log('✅ 30 Moroccan users created');

    // Create subscriptions for all users with random durations between 0-45 days
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      
      const existingSubscription = await SubscriptionModel.findOne({ user: user._id });
      if (!existingSubscription) {
        // Generate random duration between 0-45 days
        const randomDuration = Math.floor(Math.random() * 46); // 0-45 days
        
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + randomDuration);
        
        const subscription = await SubscriptionModel.create({
          user: user._id,
          startDate: startDate,
          endDate: endDate,
        });
        
        await UserModel.findByIdAndUpdate(
          user._id,
          { $push: { subscriptions: subscription._id } },
          { new: true }
        );
        
        console.log(`✅ Subscription created for ${user.firstName} ${user.lastName} (${randomDuration} days)`);
      }
    }
    console.log('✅ All users subscribed with random durations (0-45 days)');

    // Create 10 services with varying city coverage (2-9 cities each)
    const allCities = ['Casablanca', 'Rabat', 'Fes', 'Marrakech', 'Tangier', 'Agadir', 'Meknes', 'Oujda', 'Tetouan', 'Kenitra', 'Sale', 'Temara'];
    const serviceTypes = [
      'Shopping & Personal Assistant',
      'Food Delivery',
      'Transportation & Taxi',
      'Home Cleaning',
      'Plumbing Services',
      'Electrical Services',
      'Beauty & Hairdressing',
      'Tutoring & Education',
      'Pet Care',
      'Gardening & Landscaping'
    ];
    
    for (let i = 0; i < 10; i++) {
      const serviceName = serviceTypes[i];
      const existingService = await ServiceModel.findOne({ serviceName });
      
      if (!existingService) {
        // Random number of cities between 2-9
        const numCities = Math.floor(Math.random() * 8) + 2; // 2-9 cities
        const shuffledCities = [...allCities].sort(() => 0.5 - Math.random());
        const selectedCities = shuffledCities.slice(0, numCities);
        
        await ServiceModel.create({
          serviceName,
          pricing: Math.floor(Math.random() * 500) + 50, // 50-550 MAD
          description: `Professional ${serviceName.toLowerCase()} available across multiple Moroccan cities. Quality service guaranteed.`,
          serviceImgs: [
            `https://picsum.photos/seed/service${i}a/300/200`,
            `https://picsum.photos/seed/service${i}b/300/200`,
            `https://picsum.photos/seed/service${i}c/300/200`,
          ],
          deliveryTime: `${Math.floor(Math.random() * 7) + 1}-${Math.floor(Math.random() * 7) + 8} days`,
          citiesCovered: selectedCities,
        });
        
        console.log(`✅ Service '${serviceName}' created covering ${numCities} cities: ${selectedCities.join(', ')}`);
      }
    }
    console.log('✅ 10 services created with varying city coverage (2-9 cities each)');

    console.log('✅ Seed completed successfully');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

// Seed is now called from main.ts with app context
