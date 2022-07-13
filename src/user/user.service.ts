import { createParamDecorator, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { validateInputModelInBll } from '../../helpers/validation/validateInputModelInBll';
// import { User } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findALl() {
    return this.userRepository.findALl();
  }

  async create(createUserDto: CreateUserDto) {
    const userInDb = await this.userRepository.findUserByLoginOrEmail(
      createUserDto,
    );
    if (userInDb) {
      throw new Error('User with this login/email already exists');
    }
    //TODO: где делать ID? сервис\репо т.к. при подключении другой репы(Postgres) ID автогенерируется\инкрементируется.
    // Может сделать возврат id: _id?
    await validateInputModelInBll(createUserDto, CreateUserDto);
    const userId = randomUUID();
    const newUser = await this.userRepository.create(userId, createUserDto);
    // const returnedUser = {
    //   id: userId,
    //   login: newUser.login,
    // };
    // return returnedUser;

    return {
      id: userId,
      login: newUser.login,
    };
  }
}

// const ValidateModel = createParamDecorator();
