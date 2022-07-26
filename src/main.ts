import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { pipes } from './pipes';
import { filters } from './filters';
import { middlewares } from './middlewares';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('PORT');
  app.setGlobalPrefix('/api');
  app.enableCors();
  app.use(cookieParser());
  app.use(...middlewares);
  app.useGlobalPipes(...pipes);
  app.useGlobalFilters(...filters);
  await app.listen(port);
  console.log(`App started at port: ${port}`);
}

bootstrap();
