import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TestingService } from './testing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { usersSchema } from '../schemas/users-schema';
import { bloggersSchema } from '../schemas/bloggers-schema';
import { postsSchema } from '../schemas/posts-schema';
import { commentsSchema } from '../schemas/comments-schema';
import { emailSchema } from '../schemas/emails-schema';
import { jwtSchema } from '../schemas/jwt-schema';
import { connectionsLimitsSchema } from '../schemas/connections-limits-schema';

const schemas = [
  { name: 'Users', schema: usersSchema },
  { name: 'Bloggers', schema: bloggersSchema },
  { name: 'Posts', schema: postsSchema },
  { name: 'Comments', schema: commentsSchema },
  { name: 'Emails', schema: emailSchema },
  { name: 'RefreshTokens', schema: jwtSchema },
  { name: 'ConnectionsLimits', schema: connectionsLimitsSchema },
];

@Module({
  imports: [MongooseModule.forFeature(schemas)],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
