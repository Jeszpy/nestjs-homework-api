import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix('/api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
    }),
  );
  await app.listen(config.get('PORT'));
  console.log(`Successful connect to DB: ${config.get('MONGO_URI')}`);
  console.log(`App started at port: ${config.get('PORT')}`);
}

bootstrap();

// bootstrap().then(() => {
//   console.log(`Successful connect to DB: ${configuration.mongoUri}`);
//   console.log(`App started at port: ${configuration.port}`);
// });
