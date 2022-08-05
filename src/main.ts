import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { pipes } from './pipes';
import { filters } from './filters';
import { middlewares } from './middlewares';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('Cats example')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addTag('cats')
  .build();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('PORT');

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('sapi', app, document);

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
