import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JWTService } from '../jwt/jwt.service';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JWTService,
    private userService: UserService,
  ) {}
  // async canActivate(
  //   context: ExecutionContext,
  // ): boolean | Promise<boolean> | Observable<boolean> {
  //   const request = context.switchToHttp().getRequest();
  //
  //   // return validateRequest(request);
  //
  //   const auth = request.headers.authorization;
  //   if (!auth) return false;
  //   const token = this.getCodeFromBearerAuth(auth);
  //   const userId = await this.jwtService.getUserIdByToken(token);
  //   return true;
  // }
  //
  // getCodeFromBearerAuth(fullBearer) {
  //   return fullBearer.split(' ')[1];
  // }
}
