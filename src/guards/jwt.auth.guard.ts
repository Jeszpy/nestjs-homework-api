import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JWTService } from '../jwt/jwt.service';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JWTService,
    private usersService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // : boolean | Promise<boolean> | Observable<boolean>
    const request = context.switchToHttp().getRequest();

    const auth = request.headers.authorization;
    if (!auth) return false;
    const token = this.getCodeFromBearerAuth(auth);
    const userId = await this.jwtService.getUserIdByToken(token);
    if (!userId) return false;
    request.user = await this.usersService.getOneUserById(userId);
    return true;
  }

  getCodeFromBearerAuth(fullBearer) {
    return fullBearer.split(' ')[1];
  }
}
