import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(protected userService: UserService) {}

  @Get()
  findALlUsers() {
    return this.userService.findALl();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':userId')
  @HttpCode(204)
  async updateOneUser(
    @Param('userId') userId: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    const updateUserDto = {
      id: userId,
      login: createUserDto.login,
      email: createUserDto.email,
      password: createUserDto.password,
    };
    try {
      await this.userService.updateOneUser(updateUserDto);
      return;
    } catch (e) {}
  }
}
