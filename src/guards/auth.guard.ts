import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // return validateRequest(request);

    const auth = request.headers.authorization;
    if (!auth) return false;
    const jwtCode = getCodeFromBearerAuth(auth);
    return true;
  }
}

const getCodeFromBearerAuth = (fullBearer) => {
  return fullBearer.split(' ')[1];
};
