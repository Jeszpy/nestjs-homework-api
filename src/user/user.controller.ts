import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(protected userService: UserService) {}

  @Get()
  findALl() {
    return this.userService.findALl();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
