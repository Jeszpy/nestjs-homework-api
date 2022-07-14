import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { validateInputModelInBll } from '../../helpers/validation/validateInputModelInBll';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findALl() {
    return this.userRepository.findALl();
  }

  async create(createUserDto: CreateUserDto) {
    await validateInputModelInBll(createUserDto, CreateUserDto);
    await this.checkUserInDbByLoginOrEmail(
      createUserDto.login,
      createUserDto.email,
    );
    const newUser = await this.userRepository.create(createUserDto);
    return {
      id: newUser.id,
      login: newUser.login,
    };
  }

  async updateOneUser(updateUserDto: UpdateUserDto) {
    await this.checkUserInDbById(updateUserDto.id);
    await this.checkUserInDbByLoginOrEmail(
      updateUserDto.login,
      updateUserDto.email,
    );
    return this.userRepository.updateOneUser(updateUserDto);
  }

  async checkUserInDbByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<void> {
    const loginInDb = await this.userRepository.findUserByLoginOrEmail(login);
    if (loginInDb) {
      throw new Error('User with this login already exists');
    }
    const emailInDb = await this.userRepository.findUserByLoginOrEmail(email);
    if (emailInDb) {
      throw new Error('User with this email already exists');
    }
  }

  async checkUserInDbById(userId: string): Promise<void> {
    const userIdInDb = await this.userRepository.findUserById(userId);
    if (userIdInDb) {
      throw new Error('User does not exist');
    }
  }
}

// const ValidateModel = createParamDecorator();
