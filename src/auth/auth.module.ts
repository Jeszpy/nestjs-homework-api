import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtSchema } from '../schemas/jwt-schema';
import { usersSchema } from '../schemas/users-schema';
// import { JWTService } from '../jwt/jwt.service';
// import { JwtRepository } from '../jwt/jwt.repository';

const schemas = [
  { name: 'Jwt', schema: jwtSchema },
  { name: 'User', schema: usersSchema },
];

@Module({
  imports: [MongooseModule.forFeature(schemas)],
  controllers: [AuthController],
  // providers: [AuthService, JWTService, JwtRepository],
})
export class AuthModule {}
