import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configuration } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(configuration.port);
}

bootstrap().then(() => {
  console.log(`App started at port: ${configuration.port}`);
});
