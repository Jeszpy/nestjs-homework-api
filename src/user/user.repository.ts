import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery } from 'mongoose';
import {
  UserAccountDBType,
  UserAccountType,
  UserIdAndLoginType,
} from '../types/user';
import { IUsersRepository } from './user.service';

@Injectable()
export class UserRepository implements IUsersRepository {
  constructor(
    @InjectModel('Users') private userModel: mongoose.Model<UserAccountDBType>,
  ) {}

  async getOneUserForJWT(login: string): Promise<UserAccountType | null> {
    const user = await this.userModel.findOne({ 'accountData.login': login });
    if (!user) {
      return null;
    }
    return user.accountData;
  }

  async getOneUserById(id: string): Promise<UserIdAndLoginType | null> {
    const user = await this.userModel.findOne({ 'accountData.id': id });
    if (!user) return null;
    return {
      id: user.accountData.id,
      login: user.accountData.login,
    };
  }

  async getAllUsers(
    pageNumber: number,
    pageSize: number,
  ): Promise<UserIdAndLoginType[]> {
    const allUsers = await this.userModel
      .find({}, {})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    return allUsers.map((u) => ({
      id: u.accountData.id,
      login: u.accountData.login,
    }));
  }

  async createUser(newUser: UserAccountDBType): Promise<UserIdAndLoginType> {
    await this.userModel.create({ ...newUser });
    return {
      id: newUser.accountData.id,
      login: newUser.accountData.login,
    };
  }

  async deleteUserById(id: string): Promise<boolean> {
    const isUserDeleted = await this.userModel.deleteOne({
      'accountData.id': id,
    });
    return isUserDeleted.deletedCount === 1;
  }

  async getTotalCount(filter: FilterQuery<UserAccountDBType>): Promise<number> {
    return this.userModel.countDocuments(filter);
  }

  async getUserByConfirmationCode(
    code: string,
  ): Promise<UserAccountDBType | null> {
    return this.userModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  async confirmEmailRegistration(user: UserAccountDBType): Promise<boolean> {
    const result = await this.userModel.updateOne(
      {
        'emailConfirmation.confirmationCode':
          user.emailConfirmation.confirmationCode,
      },
      {
        $set: { 'emailConfirmation.isConfirmed': true },
      },
    );
    return result.modifiedCount === 1;
  }

  async findOneUserByEmail(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ 'accountData.email': email });
    return !!user;
  }

  async findOneUserByLogin(login: string): Promise<boolean> {
    const user = await this.userModel.findOne({ 'accountData.login': login });
    return !!user;
  }

  async getOneUserByEmail(email: string): Promise<UserAccountDBType | null> {
    return this.userModel.findOne({ 'accountData.email': email });
  }

  async updateOneUserByEmail(
    email: string,
    updateData: UserAccountDBType,
  ): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { 'accountData.email': email },
      { $set: { ...updateData } },
    );
    return result.modifiedCount === 1;
  }

  async findCodeInDB(code: string): Promise<UserAccountDBType | null> {
    const res = await this.userModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
    return res ? res : null;
  }

  async getUserInfoById(userId: string): Promise<UserAccountDBType | null> {
    return this.userModel.findOne({ 'accountData.id': userId });
  }

  async getUserIdByLoginOrEmail(loginOrEmail: string): Promise<string | null> {
    const accountDataId = await this.userModel.findOne(
      {
        $or: [
          { 'accountData.login': loginOrEmail },
          { 'accountData.email': loginOrEmail },
        ],
      },
      { 'accountData.id': true, _id: false },
    );
    if (accountDataId === null) return null;
    return accountDataId.accountData.id;
  }
}
