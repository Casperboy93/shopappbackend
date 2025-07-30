import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  // ✅ Allow frontend to access backend
  app.enableCors({
    origin: 'http://localhost:5173', // frontend Vite dev server
    credentials: true,               // required if using cookies for auth
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('BS Backend API')
    .setDescription('API documentation for the freelancing platform')
    .setVersion('1.0')
    .addBearerAuth() // Enables "Authorize" in Swagger for JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
