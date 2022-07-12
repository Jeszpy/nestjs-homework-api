import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { transaction } from '../../helpers/mongoose/transaction';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  //TODO: find another way of projection
  async findALl() {
    return this.userModel.find({}, { _id: false, __v: false }).exec();
  }

  async create(id: string, createUserDto: CreateUserDto) {
    //TODO: ask about transactions
    // return transaction(this.userModel, create(CreateUserDto));

    let newUser: CreateUserDto;
    const session = await this.userModel.startSession();
    await session.withTransaction(async () => {
      newUser = await this.userModel.create({
        id,
        login: createUserDto.login,
        email: createUserDto.email,
        password: createUserDto.password,
      });
    });
    return newUser;

    // return this.userModel.create(createUserDto);
  }

  //TODO: подумать/исправить "createUserDto"
  async findUserByLoginOrEmail(createUserDto: CreateUserDto) {
    return this.userModel
      .findOne(
        {
          $or: [{ login: createUserDto.login }, { email: createUserDto.email }],
        },
        { _id: false, __v: false },
      )
      .exec();
  }
}
