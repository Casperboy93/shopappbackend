import { config } from 'dotenv';
config(); // Load .env

import { DataSource } from 'typeorm';
import { User, UserRole, UserStatus } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

// Setup the data source using .env
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: false,
});

async function seedAdmin() {
  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);

  const existing = await userRepo.findOne({ where: { email: 'bsadmin' } });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = userRepo.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'bsadmin',
    password: hashedPassword,
    phone: '0000000000',
    dob: new Date('1990-01-01'),
    city: 'Default City',
    address: 'Default Address',
    job: 'Administrator',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
  });

  await userRepo.save(admin);
  console.log('✅ Admin created successfully!');
  process.exit(0);
}

seedAdmin().catch((e) => {
  console.error('❌ Error seeding admin:', e);
  process.exit(1);
});
