import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Only import seed in development or when explicitly needed
// import { seedAdminAndData } from './scripts/seed';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

  // Fix port binding for Render.com
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port ${port}`);

  // Only run seed in development or when ENABLE_SEED is true
  if (process.env.NODE_ENV === 'development' || process.env.ENABLE_SEED === 'true') {
    try {
      const { seedAdminAndData } = await import('./scripts/seed');
      await seedAdminAndData(app);
      console.log('✅ Seed executed successfully (admin/users/services)');
    } catch (err) {
      console.error('❌ Seed failed:', err.message);
    }
  }
}

bootstrap();
