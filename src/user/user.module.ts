import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { usersSchema } from '../schemas/users-schema';
import { UserController } from './user.controller';
import { EmailRepository } from '../email/email.repository';
import { emailSchema } from '../schemas/emails-schema';

const schemas = [
  { name: 'User', schema: usersSchema },
  { name: 'Email', schema: emailSchema },
];

@Module({
  imports: [MongooseModule.forFeature(schemas)],
  providers: [UserService, UserRepository, EmailRepository],
  controllers: [UserController],
})
export class UserModule {}
