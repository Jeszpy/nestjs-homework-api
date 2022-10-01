import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // const globalPrefix = '/api';
  // const authController = '/auth';
  //
  // const validLogin = 'Hleb';
  // const validEmail = 'gleb.luk.go@gmail.com';
  // const validPassword = 'testing';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  // describe('/AuthController', () => {
  //   it('/registration (POST)', () => {
  //     const url = `${globalPrefix}${authController}/registration/`;
  //     console.log(url);
  //     return request(app.getHttpServer())
  //       .post(url)
  //       .send({ login: validLogin, email: validEmail, password: validPassword })
  //       .expect(204);
  //   });
  // });

  afterAll(async () => {
    await app.close();
  });
});
