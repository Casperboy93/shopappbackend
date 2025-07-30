import { config } from 'dotenv';
config();
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from '../user/entities/user.entity';
import { Service } from '../services/entities/service.entity';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [User, Service, Subscription], // ← ✅ Add all used entities here
  synchronize: false,
});


export async function seedAdminAndData() {
  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);
  const serviceRepo = dataSource.getRepository(Service);

  const existingAdmin = await userRepo.findOne({ where: { email: 'admin@test.com' } });
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
  } else {
    console.log('ℹ️ Admin already exists');
  }

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
        profileImg: `https://i.pravatar.cc/300?img=${i}`,
      });
      await userRepo.save(user);
    }
  }
  console.log('✅ 20 users created');

  const cities = ['Casablanca', 'Rabat', 'Fes'];
  for (let i = 1; i <= 10; i++) {
    const service = serviceRepo.create({
      serviceName: `Service ${i}`,
      pricing: 50 + i * 10,
      description: `This is the description for service ${i}`,
      serviceImgs: [
        `https://picsum.photos/seed/service${i}a/300/200`,
        `https://picsum.photos/seed/service${i}b/300/200`,
      ],
      deliveryTime: `${2 + i} days`,
      citiesCovered: cities,
    });
    await serviceRepo.save(service);
  }
  console.log('✅ 10 services created');

  await dataSource.destroy();
}

if (require.main === module) {
  seedAdminAndData().catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  });
}
