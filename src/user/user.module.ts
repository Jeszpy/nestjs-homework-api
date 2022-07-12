import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';

const schemas = [{ name: User.name, schema: UserSchema }];

@Module({
  imports: [MongooseModule.forFeature(schemas)],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
