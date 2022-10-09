import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserIdAndLoginType, UserInfoType } from '../types/user';
import { PaginationResultType } from '../helpers/pagination/pagination';
import { CreateUserDto } from './dto/createUser.dto';
import { Pagination } from '../decorators/http/param/pagination.param.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(@Pagination() { pageNumber, pageSize }) {
    return await this.userService.getAllUsers(pageNumber, pageSize);
  }

  @HttpCode(201)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(
      createUserDto.login,
      createUserDto.email,
      createUserDto.password,
    );
    if (!newUser) throw new BadRequestException();
    return newUser;
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    const isUserDeleted = await this.userService.deleteUserById(id);
    if (!isUserDeleted) throw new NotFoundException();
    return isUserDeleted;
  }
}

export interface IUsersService {
  getAllUsers(pageNumber: any, pageSize: any): Promise<PaginationResultType>;

  createUser(
    login: string,
    email: string,
    password: string,
  ): Promise<UserIdAndLoginType | null>;

  deleteUserById(id: string): Promise<boolean>;

  getOneUserById(userId: string): Promise<UserIdAndLoginType | null>;

  getUserInfoById(userId: string): Promise<UserInfoType | null>;
}
