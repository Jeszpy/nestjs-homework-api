import { Injectable } from '@nestjs/common';
import { IAuthService } from './auth.controller';
import { UserRepository } from '../user/user.repository';
import { EmailRepository } from '../email/email.repository';
import { UserAccountDBType } from '../types/user';
import { addMinutes } from 'date-fns';
import { randomUUID } from 'crypto';
import { EmailType } from '../types/emails';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private usersRepository: UserRepository,
    private readonly emailsRepository: EmailRepository,
  ) {}

  async isCodeConfirmed(code: string): Promise<boolean> {
    const user = await this.usersRepository.getUserByConfirmationCode(code);
    if (!user) {
      return false;
    }
    return user.emailConfirmation.isConfirmed;
  }

  async confirmEmail(code: string): Promise<boolean | null> {
    const confirmationDate = new Date();
    const user = await this.usersRepository.getUserByConfirmationCode(code);
    if (!user) {
      return null;
    }
    const expirationDate = new Date(user.emailConfirmation.expirationDate);
    if (+confirmationDate > +expirationDate) {
      return null;
    }
    return await this.usersRepository.confirmEmailRegistration(user);
  }

  async findOneUserByEmail(email: string): Promise<boolean> {
    return await this.usersRepository.findOneUserByEmail(email);
  }

  async findOneUserByLogin(login: string): Promise<boolean> {
    return this.usersRepository.findOneUserByLogin(login);
  }

  async registrationEmailResending(email: string): Promise<boolean> {
    const user = await this.usersRepository.getOneUserByEmail(email);
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    const newUserInfo: UserAccountDBType = {
      accountData: user.accountData,
      emailConfirmation: {
        isConfirmed: user.emailConfirmation.isConfirmed,
        confirmationCode: randomUUID(),
        expirationDate: addMinutes(new Date(), 3),
        sentEmails: user.emailConfirmation.sentEmails,
      },
      loginAttempts: user.loginAttempts,
    };
    await this.usersRepository.updateOneUserByEmail(email, newUserInfo);
    const emailInfo: EmailType = {
      id: randomUUID(),
      email,
      subject: 'registration-email-resending',
      userLogin: user.accountData.login,
      confirmationCode: newUserInfo.emailConfirmation.confirmationCode,
      status: 'pending',
      createdAt: user.accountData.createdAt,
    };
    await this.emailsRepository.insertEmailToQueue(emailInfo);
    return true;
  }

  async findCodeInDB(code: string): Promise<UserAccountDBType | null> {
    return this.usersRepository.findCodeInDB(code);
  }
}

export interface IAuthRepository {
  getUserByConfirmationCode(code: string): Promise<UserAccountDBType | null>;

  confirmEmailRegistration(user: UserAccountDBType): Promise<boolean>;

  findOneUserByEmail(email: string): Promise<boolean>;

  findOneUserByLogin(login: string): Promise<boolean>;

  getOneUserByEmail(email: string): Promise<UserAccountDBType | null>;

  updateOneUserByEmail(
    email: string,
    updateData: UserAccountDBType,
  ): Promise<boolean>;

  findCodeInDB(code: string): Promise<UserAccountDBType | null>;
}
