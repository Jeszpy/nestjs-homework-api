import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
// import { globalMiddlewares } from './middlewares';
import { globalPipes } from './pipes';
import { globalFilters } from './filters';
import { INestApplication } from '@nestjs/common';

export const addAppSettings = (app: INestApplication) => {
  app.setGlobalPrefix('/api');
  app.enableCors();
  app.use(cookieParser());
  // app.use(...globalMiddlewares);
  app.useGlobalPipes(...globalPipes);
  app.useGlobalFilters(...globalFilters);
  return app;
};

async function bootstrap() {
  let app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('PORT');
  app = addAppSettings(app);
  await app.listen(port);
  console.log(`App started at port: ${port}`);
}

bootstrap();
