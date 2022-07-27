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
  private readonly secret: string;
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
    this.secret = this.configService.get<string>(constants.JWT_SECRET);
  }

  async validate(payload: any) {
    return { userId: payload.userId };
  }
}
