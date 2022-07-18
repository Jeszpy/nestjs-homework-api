import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { usersSchema } from '../schemas/users-schema';
import { UserController } from './user.controller';

const schemas = [{ name: 'User', schema: usersSchema }];

@Module({
  imports: [MongooseModule.forFeature(schemas)],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
