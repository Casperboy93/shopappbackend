import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

import { seedAdminAndData } from './scripts/seed';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      process.env.CORS_ORIGIN || 'http://localhost:5173','http://beauservice.com',
      'https://www.beauservice.com',
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'https://uncomplicated.onrender.com',
      'http://beauservice.com',
      'https://www.beauservice.com',
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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

  // Fix port binding for Render.com
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port ${port}`);

  // Run the lightweight seed logic
  try {
    await seedAdminAndData(app);
    console.log('✅ Seed executed successfully (admin only)');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  }
}

bootstrap();
