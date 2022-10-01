import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { constants } from '../../constants';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   private secret;
//   constructor(private configService: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: this.configService,
//     });
//     this.secret = this.configService.get<string>(constants.JWT_SECRET);
//   }
//
//   async validate(payload: any) {
//     return { userId: payload.sub, username: payload.username };
//   }
// }

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>(constants.JWT_SECRET);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId };
  }
}
