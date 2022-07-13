import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './exception.filter';
import { validationPipe } from '../pipes';

const filters = new HttpExceptionFilter();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('PORT');
  // const mongoUri = config.get('MONGO_URI');
  app.setGlobalPrefix('/api');
  app.enableCors();
  app.useGlobalPipes(validationPipe);
  app.useGlobalFilters(filters);
  await app.listen(port);
  // console.log(`Successful connect to DB: ${mongoUri}`);
  console.log(`App started at port: ${port}`);
}

bootstrap();

// bootstrap().then(() => {
//   console.log(`Successful connect to DB: ${configuration.mongoUri}`);
//   console.log(`App started at port: ${configuration.port}`);
// });
