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

const schemas = [
  { name: 'Jwt', schema: jwtSchema },
  { name: 'User', schema: usersSchema },
  { name: 'Email', schema: emailSchema },
];

@Module({
  imports: [MongooseModule.forFeature(schemas)],
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
