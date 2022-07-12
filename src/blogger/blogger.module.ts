import { Module } from '@nestjs/common';
import { BloggerService } from './blogger.service';
import { BloggerController } from './blogger.controller';

@Module({
  controllers: [BloggerController],
  providers: [BloggerService],
})
export class BloggerModule {}
