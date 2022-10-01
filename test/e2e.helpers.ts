import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { pipes } from '../src/pipes';
import { filters } from '../src/filters';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';

const globalPrefix = '/api';
const authController = `${globalPrefix}/auth`;
const testingController = `${globalPrefix}/testing`;

export const routes = {
  authController: {
    registration: `${authController}/registration`,
    registrationEmailResending: `${authController}/registration-email-resending`,
  },
  testingController: {
    allData: `${testingController}/all-data`,
  },
};

export const createAppFor2E2Tests = async (app: INestApplication) => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(...pipes);
  app.useGlobalFilters(...filters);
  return app;
};

export const wipeAllData = async (
  request: typeof supertest,
  app: INestApplication,
) => {
  const url = routes.testingController.allData;
  const response = await request(app.getHttpServer()).delete(url);
  return response;
};
