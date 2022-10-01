import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MailBoxImap } from '../imap.service';
import * as cheerio from 'cheerio';
import { isUUID } from '@nestjs/common/utils/is-uuid';
import { createAppFor2E2Tests, routes, wipeAllData } from '../e2e.helpers';
import mongoose from 'mongoose';
import { usersSchema } from '../../src/schemas/users-schema';
import { UserRepository } from '../../src/user/user.repository';

describe('AuthController (e2e)', () => {
  jest.setTimeout(150 * 1000);

  // Jest STATE: {mailBox, validConfirmationCode}
  let app: INestApplication;

  const UsersModel = mongoose.model('Users', usersSchema);
  const usersRepository = new UserRepository(UsersModel);

  const preparedData = {
    valid: {
      login: 'Gleb',
      email: 'hleb.lukashonak@yandex.by',
      password: 'testing',
      newLogin: 'Test',
      newEmail: 'gleb.luk.go@gmail.com',
    },
    invalid: {
      login: 'invalidLogin1234567890',
      email: 'invalidEmail',
      password: 'invalidPasswordInvalidPassword',
      confirmationCode: 'invalidConfirmationCode',
    },
  };

  beforeAll(async () => {
    // createAppFor2E2Tests => see in e2e.helpers
    app = await createAppFor2E2Tests(app);
    await app.init();

    const mailBox = new MailBoxImap();
    await mailBox.connectToMail();

    expect.setState({ mailBox });
  });

  afterAll(async () => {
    await app.close();
    const mailBox: MailBoxImap = expect.getState().mailBox;
    await mailBox.disconnect();
  });

  describe('Wipe all Data', () => {
    it('should wipe all data in DB and return 204 status code', async () => {
      const response = await wipeAllData(request, app);
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });

  describe('/registration (POST)', () => {
    const registrationUrl = routes.authController.registration;

    it('send wrong LOGIN should return 400 status code and error message, ', async () => {
      const response = await request(app.getHttpServer())
        .post(registrationUrl)
        .send({
          login: preparedData.invalid.login,
          email: preparedData.valid.email,
          password: preparedData.valid.password,
        });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errorsMessages: [
          {
            message: 'login must be shorter than or equal to 10 characters',
            field: 'login',
          },
        ],
      });
    });

    it('send wrong EMAIL should return 400 status code and error message, ', async () => {
      const response = await request(app.getHttpServer())
        .post(registrationUrl)
        .send({
          login: preparedData.valid.login,
          email: preparedData.invalid.email,
          password: preparedData.valid.password,
        });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errorsMessages: [
          {
            message: 'email must be an email',
            field: 'email',
          },
        ],
      });
    });

    it('send wrong PASSWORD should return 400 status code and error message, ', async () => {
      const response = await request(app.getHttpServer())
        .post(registrationUrl)
        .send({
          login: preparedData.valid.login,
          email: preparedData.valid.email,
          password: preparedData.invalid.password,
        });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errorsMessages: [
          {
            message: 'password must be shorter than or equal to 20 characters',
            field: 'password',
          },
        ],
      });
    });

    it('should create new User and return 204 status code', async () => {
      const response = await request(app.getHttpServer())
        .post(registrationUrl)
        .send({
          login: preparedData.valid.login,
          email: preparedData.valid.email,
          password: preparedData.valid.password,
        });
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should read new email and get validConfirmationCode', async () => {
      const mailBox: MailBoxImap = expect.getState().mailBox;
      const email = await mailBox.waitNewMessage(2);
      const html = await mailBox.getMessageHtml(email);
      expect(html).not.toBeNull();
      const link = cheerio.load(html).root().find('a').attr('href');
      const validConfirmationCode = link.split('?')[1].split('=')[1];
      expect(validConfirmationCode).not.toBeNull();
      expect(validConfirmationCode).not.toBeUndefined();
      const isUuid = isUUID(validConfirmationCode);
      expect(isUuid).toBeTruthy();
      // if (isUuid) await mailBox.deleteAllTodayMessages();
      expect.setState({ validConfirmationCode });
    });

    it('should return error because LOGIN already in DB', async () => {
      const response = await request(app.getHttpServer())
        .post(registrationUrl)
        .send({
          login: preparedData.valid.login,
          email: preparedData.valid.newEmail,
          password: preparedData.valid.password,
        });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errorsMessages: [
          {
            message: 'this login has already been created',
            field: 'login',
          },
        ],
      });
    });

    it('should return error because EMAIL already in DB', async () => {
      const response = await request(app.getHttpServer())
        .post(registrationUrl)
        .send({
          login: preparedData.valid.newLogin,
          email: preparedData.valid.email,
          password: preparedData.valid.password,
        });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errorsMessages: [
          {
            message: 'this email has already been created',
            field: 'email',
          },
        ],
      });
    });
  });

  // TODO: move to another file
  // describe('/registration-email-resending POST', () => {
  //   const registrationEmailResendingUrl =
  //     routes.authController.registrationEmailResending;
  //
  //   it('should return error because email is invalid', async () => {
  //     const response = await request(app.getHttpServer())
  //       .post(registrationEmailResendingUrl)
  //       .send({
  //         email: invalidEmail,
  //       });
  //     expect(response.status).toBe(400);
  //   });
  //
  //   it('should return error because email is not in DB', async () => {
  //     const response = await request(app.getHttpServer())
  //       .post(registrationEmailResendingUrl)
  //       .send({
  //         email: `${invalidEmail}@gmail.com`,
  //       });
  //     expect(response.status).toBe(400);
  //     expect(response.body).toEqual({
  //       errorsMessages: [
  //         { message: 'user with this email was not found', field: 'email' },
  //       ],
  //     });
  //   });
  //
  //   // DONT WORK IF EMAIL NOT IN DB
  //   it('should send new email with new confirmationCode', async () => {
  //     const response = await request(app.getHttpServer())
  //       .post(registrationEmailResendingUrl)
  //       .send({
  //         email: validEmail,
  //       });
  //     expect(response.status).toBe(204);
  //     const mailBox: MailBoxImap = expect.getState().mailBox;
  //     const email = await mailBox.waitNewMessage(2);
  //     const html = await mailBox.getMessageHtml(email);
  //     expect(html).not.toBeNull();
  //     const link = cheerio.load(html).root().find('a').attr('href');
  //     const newValidConfirmationCode = link.split('?')[1].split('=')[1];
  //     expect(newValidConfirmationCode).not.toBeNull();
  //     expect(newValidConfirmationCode).not.toBeUndefined();
  //     const isUuid = isUUID(newValidConfirmationCode);
  //     expect(isUuid).toBeTruthy();
  //     const validConfirmationCode = expect.getState().validConfirmationCode;
  //     expect(newValidConfirmationCode).not.toEqual(validConfirmationCode);
  //     expect.setState({ validConfirmationCode: newValidConfirmationCode });
  //   });
  // });

  // describe('', () => {
  //   it('should return error because confirmationCode is invalid', async () => {});
  // });
});
