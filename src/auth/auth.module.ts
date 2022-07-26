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
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JWTService,
    JwtRepository,
    UserService,
    UserRepository,
    EmailRepository,
  ],
})
export class AuthModule {}
