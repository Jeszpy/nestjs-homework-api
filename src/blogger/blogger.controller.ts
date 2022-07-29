import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { BloggerService } from './blogger.service';
import { CreateBloggerDto } from './dto/create-blogger.dto';
import { UpdateBloggerDto } from './dto/update-blogger.dto';
import { PostsService } from '../posts/posts.service';
import { CreatePostDto } from '../posts/dto/create-post.dto';

@Controller('bloggers')
export class BloggerController {
  constructor(
    private readonly bloggersService: BloggerService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  create(@Body() createBloggerDto: CreateBloggerDto) {
    return this.bloggersService.create(createBloggerDto);
  }

  @Get()
  findAll(
    @Query('pageSize', ParseIntPipe) pageSize,
    @Query('pageNumber', ParseIntPipe) pageNumber,
    @Query('searchNameTerm') searchNameTerm: string,
  ) {
    console.log(searchNameTerm);
    return this.bloggersService.findAll(searchNameTerm, pageNumber, pageSize);
  }

  @Get(':bloggerId')
  findOne(@Param('bloggerId') bloggerId: string) {
    return this.bloggersService.findOne(bloggerId);
  }

  @Put(':bloggerId')
  update(
    @Param('bloggerId') bloggerId: string,
    @Body() updateBloggerDto: UpdateBloggerDto,
  ) {
    return this.bloggersService.update(bloggerId, updateBloggerDto);
  }

  @Delete(':bloggerId')
  remove(@Param('bloggerId') bloggerId: string) {
    return this.bloggersService.remove(bloggerId);
  }

  @Get(':bloggerId/posts')
  findBloggerPosts(@Param('bloggerId') bloggerId: string) {
    return;
  }

  @Post(':bloggerId/posts')
  craetePostForBlogger(
    @Param('bloggerId') bloggerId: string,
    createPostDto: CreatePostDto,
  ) {
    return;
  }
}
