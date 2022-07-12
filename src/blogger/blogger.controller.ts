import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BloggerService } from './blogger.service';
import { CreateBloggerDto } from './dto/create-blogger.dto';
import { UpdateBloggerDto } from './dto/update-blogger.dto';

@Controller('blogger')
export class BloggerController {
  constructor(private readonly bloggerService: BloggerService) {}

  @Post()
  create(@Body() createBloggerDto: CreateBloggerDto) {
    return this.bloggerService.create(createBloggerDto);
  }

  @Get()
  findAll() {
    return this.bloggerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bloggerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBloggerDto: UpdateBloggerDto) {
    return this.bloggerService.update(+id, updateBloggerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bloggerService.remove(+id);
  }
}
