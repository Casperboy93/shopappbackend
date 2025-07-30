import { config } from 'dotenv';
config(); // Load .env

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from '../user/entities/user.entity';
import { Service } from '../services/entities/service.entity';

// Initialize datasource
const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [User, Service],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);
  const serviceRepo = dataSource.getRepository(Service);

  // Seed Admin
  const existingAdmin = await userRepo.findOne({ where: { email: 'bsadmin' } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = userRepo.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'bsadmin',
      password: hashedPassword,
      phone: '0000000000',
      dob: new Date('1990-01-01'),
      city: 'Admin City',
      address: 'Admin HQ',
      job: 'Administrator',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });
    await userRepo.save(admin);
    console.log('✅ Admin created');
  }

  // Seed 20 Users
  for (let i = 1; i <= 20; i++) {
    const email = `user${i}@test.com`;
    const existing = await userRepo.findOne({ where: { email } });
    if (!existing) {
      const user = userRepo.create({
        firstName: `User${i}`,
        lastName: 'Test',
        email,
        password: await bcrypt.hash('password123', 10),
        phone: `06000000${i.toString().padStart(2, '0')}`,
        dob: new Date('1995-01-01'),
        city: 'Casablanca',
        address: '123 Street',
        job: 'Freelancer',
        status: UserStatus.ACTIVE,
        profileImg: `https://example.com/img/user${i}.png`,
      });
      await userRepo.save(user);
    }
  }
  console.log('✅ 20 users created');

  // Seed 10 Services
  const cities = ['Casablanca', 'Rabat', 'Fes'];
  for (let i = 1; i <= 10; i++) {
    const service = serviceRepo.create({
      serviceName: `Service ${i}`,
      pricing: 50 + i * 10,
      description: `This is the description for service ${i}`,
      serviceImgs: [
        `https://example.com/img/service${i}_1.png`,
        `https://example.com/img/service${i}_2.png`,
      ],
      deliveryTime: `${2 + i} days`,
      citiesCovered: cities,
    });
    await serviceRepo.save(service);
  }
  console.log('✅ 10 services created');

  process.exit(0);
}

seed().catch((e) => {
  console.error('❌ Seed error:', e);
  process.exit(1);
});
