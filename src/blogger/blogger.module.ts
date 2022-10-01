import { Module } from '@nestjs/common';
import { BloggerService } from './blogger.service';
import { BloggerController } from './blogger.controller';
import { PostsService } from '../posts/posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { bloggersSchema } from '../schemas/bloggers-schema';
import { postsSchema } from '../schemas/posts-schema';
import { BloggerRepository } from './blogger.repository';
import { PostsRepository } from '../posts/posts.repository';

const schemas = [
  { name: 'Bloggers', schema: bloggersSchema },
  { name: 'Posts', schema: postsSchema },
];

@Module({
  imports: [MongooseModule.forFeature(schemas)],
  controllers: [BloggerController],
  providers: [BloggerService, BloggerRepository, PostsService, PostsRepository],
})
export class BloggerModule {}
