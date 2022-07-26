import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import {
  UserAccountDBType,
  UserAccountType,
  UserIdAndLoginType,
  UserInfoType,
} from '../types/user';
import { EmailType } from '../types/emails';
import { Filter } from 'mongodb';
import { randomUUID } from 'crypto';
import { addMinutes } from 'date-fns';
import {
  pagination,
  PaginationResultType,
} from '../helpers/pagination/pagination';
import * as argon2 from 'argon2';
import { EmailRepository } from '../email/email.repository';
import { IUsersService } from './user.controller';
import { EmailService } from '../email/email.service';

@Injectable()
export class UserService implements IUsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailRepository: EmailRepository,
  ) {}

  async getAllUsers(
    pageNumber: any,
    pageSize: any,
  ): Promise<PaginationResultType> {
    const users: UserIdAndLoginType[] = await this.userRepository.getAllUsers(
      pageNumber,
      pageSize,
    );
    const totalCount = await this.userRepository.getTotalCount({});
    return pagination(pageNumber, pageSize, totalCount, users);
  }

  async getOneUserById(id: string): Promise<UserIdAndLoginType | null> {
    return await this.userRepository.getOneUserById(id);
  }

  async createUser(
    login: string,
    email: string,
    password: string,
  ): Promise<UserIdAndLoginType | null> {
    const emailInDB = await this.userRepository.findOneUserByEmail(email);
    if (emailInDB) return null;
    const loginInDB = await this.userRepository.findOneUserByLogin(login);
    if (loginInDB) return null;
    const hash = await argon2.hash(password);
    const newUser: UserAccountDBType = {
      accountData: {
        id: randomUUID(),
        login,
        email,
        password: hash,
        createdAt: new Date(),
      },
      loginAttempts: [],
      emailConfirmation: {
        sentEmails: [],
        confirmationCode: randomUUID(),
        expirationDate: addMinutes(new Date(), 3),
        isConfirmed: false,
      },
    };
    const user = await this.userRepository.createUser(newUser);
    const emailInfo: EmailType = {
      id: randomUUID(),
      email,
      subject: 'registration',
      userLogin: login,
      confirmationCode: newUser.emailConfirmation.confirmationCode,
      status: 'pending',
      createdAt: newUser.accountData.createdAt,
    };
    await this.emailRepository.insertEmailToQueue(emailInfo);
    return user;
  }

  async deleteUserById(id: string): Promise<boolean> {
    return await this.userRepository.deleteUserById(id);
  }

  async getUserInfoById(userId: string): Promise<UserInfoType | null> {
    const user = await this.userRepository.getUserInfoById(userId);
    if (!user) return null;
    return {
      userId: user.accountData.id,
      login: user.accountData.login,
      email: user.accountData.email,
    };
  }
}

export interface IUsersRepository {
  getAllUsers(
    pageNumber: number,
    pageSize: number,
  ): Promise<UserIdAndLoginType[]>;

  getOneUserById(id: string): Promise<UserIdAndLoginType | null>;

  createUser(newUser: UserAccountDBType): Promise<UserIdAndLoginType>;

  deleteUserById(id: string): Promise<boolean>;

  getTotalCount(filter: Filter<UserAccountDBType>): Promise<number>;

  getOneUserForJWT(login: string): Promise<UserAccountType | null>;

  findOneUserByLogin(login: string): Promise<boolean>;

  findOneUserByEmail(email: string): Promise<boolean>;

  getUserInfoById(userId: string): Promise<UserAccountDBType | null>;
}

export interface IEmailsRepository {
  insertEmailToQueue(emailInfo: EmailType): Promise<boolean>;

  getEmailFromQueue(): Promise<EmailType | null>;

  changeStatus(emailId: string, newStatus: string): Promise<boolean>;
}
