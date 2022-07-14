import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  //TODO: find another way of projection
  async findALl() {
    return this.userModel.find({}, { _id: false, __v: false }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create({
      id: randomUUID(),
      login: createUserDto.login,
      email: createUserDto.email,
      password: createUserDto.password,
    });
    //TODO: ask about transactions
    // return transaction(this.userModel, create(CreateUserDto));
    // const session = await this.userModel.startSession();
    // await session.withTransaction(async () => {
    //   return await this.userModel.create({
    //     id,
    //     login: createUserDto.login,
    //     email: createUserDto.email,
    //     password: createUserDto.password,
    //   });
    // });
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    return this.userModel
      .findOne(
        {
          $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
        },
        { _id: false, __v: false },
      )
      .exec();
  }

  async updateOneUser(updateUserDto: UpdateUserDto) {
    const updatedData = await this.userModel.updateOne(
      { $or: [{ login: updateUserDto.login }, { email: updateUserDto.email }] },
      {
        $set: {
          login: updateUserDto.login,
          email: updateUserDto.email,
          password: updateUserDto.password,
        },
      },
      { projection: { _id: false, __v: false } },
    );
    console.log(updatedData);
  }

  async findUserById(userId: string): Promise<User | null> {
    return this.userModel.findOne({ id: userId }, { _id: false, __v: false });
  }
}
