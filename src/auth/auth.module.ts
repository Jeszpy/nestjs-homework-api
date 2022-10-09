import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtSchema } from '../schemas/jwt-schema';
import { usersSchema } from '../schemas/users-schema';
import { JWTService } from '../jwt/jwt.service';
import { JwtRepository } from '../jwt/jwt.repository';
import { UserRepository } from '../user/user.repository';
import { EmailRepository } from '../email/email.repository';
import { emailSchema } from '../schemas/emails-schema';
import { UserService } from '../user/user.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { appConstants } from '../appConstants';

const schemas = [
  { name: 'RefreshTokens', schema: jwtSchema },
  { name: 'Users', schema: usersSchema },
  { name: 'Emails', schema: emailSchema },
];

@Module({
  imports: [
    MongooseModule.forFeature(schemas),
    ThrottlerModule.forRoot({
      ttl: 10 * 1000,
      limit: 5,
    }),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>(appConstants.JWT_SECRET),
          signOptions: {
            expiresIn: config.get<string | number>(
              appConstants.ACCESS_TOKEN_EXPIRES_IN,
            ),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JWTService,
    JwtRepository,
    UserService,
    UserRepository,
    EmailRepository,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
