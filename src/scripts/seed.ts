import { config } from 'dotenv';
config();
import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { getConnectionToken } from '@nestjs/mongoose';
import { User, UserRole, UserStatus, UserSchema } from '../user/entities/user.entity';
import { Service, ServiceSchema } from '../services/entities/service.entity';
import { Subscription, SubscriptionSchema } from '../subscriptions/entities/subscription.entity';
import { Connection, Document } from 'mongoose';

// Add proper type for User document
type UserDocument = Document & User & { _id: any };

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

    // Create 12 Moroccan users
    const moroccanCities = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'El Jadida'];
    const moroccanJobs = ['Coiffeur', 'Esthéticienne', 'Masseur', 'Manucure', 'Barbier', 'Maquilleur', 'Spa Therapist', 'Beauty Consultant', 'Hair Stylist', 'Nail Artist', 'Facial Specialist', 'Wellness Coach'];
    const moroccanFirstNames = ['Ahmed', 'Fatima', 'Mohammed', 'Aicha', 'Youssef', 'Khadija', 'Omar', 'Zineb', 'Hassan', 'Nadia', 'Karim', 'Samira'];
    const moroccanLastNames = ['Alami', 'Benali', 'Chakir', 'Drissi', 'El Fassi', 'Ghali', 'Hajji', 'Idrissi', 'Jamal', 'Kabbaj', 'Lahlou', 'Mansouri'];

    // Properly type the createdUsers array
    const createdUsers: UserDocument[] = [];
    for (let i = 0; i < 12; i++) {
      const existingUser = await UserModel.findOne({ email: `user${i + 1}@morocco.com` }) as UserDocument;
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash('user123', 10);
        const user = await UserModel.create({
          firstName: moroccanFirstNames[i],
          lastName: moroccanLastNames[i],
          email: `user${i + 1}@morocco.com`,
          password: hashedPassword,
          phone: `06${String(i + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
          dob: new Date(1985 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          city: moroccanCities[i],
          address: `${Math.floor(Math.random() * 100) + 1} Rue ${moroccanCities[i]}`,
          job: moroccanJobs[i],
          description: `Professionnel de beauté expérimenté à ${moroccanCities[i]}`,
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          views: Math.floor(Math.random() * 100),
          phoneViews: Math.floor(Math.random() * 50),
          rating: Math.floor(Math.random() * 5) + 1,
        }) as UserDocument;
        createdUsers.push(user);
      } else {
        createdUsers.push(existingUser);
      }
    }
    console.log('✅ 12 Moroccan users created successfully');

    // Create 8 subscriptions for the first 8 users
    for (let i = 0; i < 8; i++) {
      const existingSubscription = await SubscriptionModel.findOne({ user: createdUsers[i]._id });
      if (!existingSubscription) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30); // 30-day subscription

        const subscription = await SubscriptionModel.create({
          user: createdUsers[i]._id,
          startDate: startDate,
          endDate: endDate,
        });

        // Add subscription to user's subscriptions array
        await UserModel.findByIdAndUpdate(
          createdUsers[i]._id,
          { $push: { subscriptions: subscription._id } },
          { new: true }
        );
      }
    }
    console.log('✅ 8 subscriptions created successfully');

    // Create 6 services
    const services = [
      {
        serviceName: 'Coupe et Coiffage Homme',
        pricing: 80,
        description: 'Coupe moderne et styling professionnel pour hommes',
        serviceImgs: ['https://example.com/haircut-men.jpg'],
        deliveryTime: '1 heure',
        citiesCovered: ['Casablanca', 'Rabat', 'Marrakech']
      },
      {
        serviceName: 'Soin Visage Complet',
        pricing: 150,
        description: 'Nettoyage, gommage et hydratation du visage',
        serviceImgs: ['https://example.com/facial.jpg'],
        deliveryTime: '1h30',
        citiesCovered: ['Casablanca', 'Fès', 'Tanger']
      },
      {
        serviceName: 'Manucure et Pédicure',
        pricing: 120,
        description: 'Soin complet des ongles des mains et des pieds',
        serviceImgs: ['https://example.com/manicure.jpg'],
        deliveryTime: '2 heures',
        citiesCovered: ['Agadir', 'Marrakech', 'Casablanca']
      },
      {
        serviceName: 'Massage Relaxant',
        pricing: 200,
        description: 'Massage thérapeutique pour détente et bien-être',
        serviceImgs: ['https://example.com/massage.jpg'],
        deliveryTime: '1 heure',
        citiesCovered: ['Rabat', 'Meknès', 'Fès']
      },
      {
        serviceName: 'Maquillage Professionnel',
        pricing: 180,
        description: 'Maquillage pour événements spéciaux et occasions',
        serviceImgs: ['https://example.com/makeup.jpg'],
        deliveryTime: '45 minutes',
        citiesCovered: ['Tanger', 'Tétouan', 'Oujda']
      },
      {
        serviceName: 'Épilation et Soins Corps',
        pricing: 100,
        description: 'Épilation professionnelle et soins hydratants',
        serviceImgs: ['https://example.com/waxing.jpg'],
        deliveryTime: '1h15',
        citiesCovered: ['Kenitra', 'Safi', 'El Jadida']
      }
    ];

    for (const serviceData of services) {
      const existingService = await ServiceModel.findOne({ serviceName: serviceData.serviceName });
      if (!existingService) {
        await ServiceModel.create(serviceData);
      }
    }
    console.log('✅ 6 services created successfully');

    console.log('✅ Complete seed with admin, 12 Moroccan users, 8 subscriptions, and 6 services completed successfully');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

// Seed is now called from main.ts with app context
