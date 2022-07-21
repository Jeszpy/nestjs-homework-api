import { Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UserIdAndLoginType, UserInfoType } from '../types/user';
import { PaginationResultType } from '../helpers/pagination';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(@Req() req, @Res() res) {
    console.log('here');
    const { pageNumber, pageSize } = req.query;
    const users = await this.userService.getAllUsers(pageNumber, pageSize);
    return res.send(users);
  }

  @Post()
  async createUser(@Req() req, @Res() res) {
    const { login, email, password } = req.body;
    const newUser = await this.userService.createUser(login, email, password);
    return newUser ? res.status(201).send(newUser) : res.sendStatus(400);
  }
  @Delete(':id')
  async deleteUserById(@Req() req, @Res() res) {
    const id = req.params.id;
    const isUserDeleted = await this.userService.deleteUserById(id);
    return isUserDeleted ? res.sendStatus(204) : res.sendStatus(404);
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
