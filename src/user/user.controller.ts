import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(protected userService: UserService) {}

  @Get('')
  findALl() {
    return this.userService.findALl();
  }
}
