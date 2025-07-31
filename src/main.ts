import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

import { seedAdminAndData } from './scripts/seed'; // seed.ts

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://uncomplicated.onrender.com/', // ⚠️ change this to your frontend URL in prod
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('BS Backend API')
    .setDescription('API documentation for the freelancing platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);

  // ✅ Run the seed logic
  try {
    await seedAdminAndData();
    console.log('✅ Seed executed successfully (admin/users/services)');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  }
}

bootstrap();
