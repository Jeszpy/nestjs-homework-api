import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UserService) {
    super({
      usernameField: 'login',
    });
  }

  async validate(login: string, password: string): Promise<any> {
    const user = await this.usersService.getUserIdByLoginOrEmail(login);
    if (!user) throw new UnauthorizedException();
    return true;
  }
}
