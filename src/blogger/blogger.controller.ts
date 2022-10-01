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
  HttpCode,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BloggerService } from './blogger.service';
import { CreateBloggerDto } from './dto/create-blogger.dto';
import { UpdateBloggerDto } from './dto/update-blogger.dto';
import { PostsService } from '../posts/posts.service';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { Pagination } from '../decorators/http/param/pagination.param.decorator';

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
  findAll(@Pagination() { pageNumber, pageSize, searchNameTerm }) {
    return this.bloggersService.findAll(searchNameTerm, pageNumber, pageSize);
  }

  @Get(':bloggerId')
  findOne(@Param('bloggerId') bloggerId: string) {
    return this.bloggersService.findOneById(bloggerId);
  }

  @HttpCode(204)
  @Put(':bloggerId')
  async update(
    @Param('bloggerId') bloggerId: string,
    @Body() updateBloggerDto: UpdateBloggerDto,
  ) {
    const isUpdated = await this.bloggersService.update(
      bloggerId,
      updateBloggerDto,
    );
    if (!isUpdated) throw new NotFoundException();
    return;
  }

  @HttpCode(204)
  @Delete(':bloggerId')
  async remove(@Param('bloggerId') bloggerId: string) {
    const isDeleted = await this.bloggersService.removeById(bloggerId);
    if (!isDeleted) throw new NotFoundException();
    return;
  }

  @Get(':bloggerId/posts')
  async getPostsForSpecificBlogger(
    @Param('bloggerId') bloggerId: string,
    @Pagination() { pageNumber, pageSize },
  ) {
    const postsForSpecificBlogger =
      await this.bloggersService.getPostsForSpecificBlogger(
        pageNumber,
        pageSize,
        bloggerId,
      );
    if (!postsForSpecificBlogger) throw new NotFoundException();
    return postsForSpecificBlogger;
  }

  @Post(':bloggerId/posts')
  craetePostForBlogger(
    @Param('bloggerId') bloggerId: string,
    createPostDto: CreatePostDto,
  ) {
    // return this.bloggersService.;
    return;
  }
}
