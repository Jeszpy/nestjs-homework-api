import { Injectable } from '@nestjs/common';
import { CreateBloggerDto } from './dto/create-blogger.dto';
import { UpdateBloggerDto } from './dto/update-blogger.dto';
import { BloggerRepository } from './blogger.repository';
import { BloggerType } from '../types/bloggers';
import {
  pagination,
  PaginationResultType,
} from '../helpers/pagination/pagination';
import { BloggerDto } from './dto/blogger.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class BloggerService {
  constructor(
    private readonly bloggersRepository: BloggerRepository,
    private readonly postsRepository: PostsRepository,
  ) {}
  async create(createBloggerDto: CreateBloggerDto) {
    // const isNameExists = this.bloggersRepository.findOne()
    const newBlogger: BloggerDto = {
      id: randomUUID(),
      name: createBloggerDto.name,
      youtubeUrl: createBloggerDto.youtubeUrl,
    };
    await this.bloggersRepository.create(newBlogger);
    return newBlogger;
  }

  async findAll(
    searchNameTerm: any,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginationResultType> {
    const bloggers: BloggerType[] = await this.bloggersRepository.findAll(
      searchNameTerm,
      pageNumber,
      pageSize,
    );
    const totalCount = await this.bloggersRepository.getTotalCount(
      searchNameTerm,
    );
    return pagination(pageNumber, pageSize, totalCount, bloggers);
  }

  findOneById(bloggerId: string) {
    return this.bloggersRepository.findOneById(bloggerId);
  }

  async update(bloggerId: string, updateBloggerDto: UpdateBloggerDto) {
    const isBloggerExist = await this.bloggersRepository.findOneById(bloggerId);
    if (!isBloggerExist) return null;
    return this.bloggersRepository.update(bloggerId, updateBloggerDto);
  }

  async removeById(bloggerId: string) {
    const isBloggerExist = await this.bloggersRepository.findOneById(bloggerId);
    if (!isBloggerExist) return null;
    return this.bloggersRepository.removeById(bloggerId);
  }

  async getPostsForSpecificBlogger(
    pageNumber: any,
    pageSize: any,
    bloggerId: string,
  ): Promise<PaginationResultType | null> {
    const blogger = await this.bloggersRepository.findOneById(bloggerId);
    if (!blogger) return null;
    //TODO: сделать отдельный метод
    const postsForSpecificBlogger = await this.postsRepository.getAllPosts(
      { bloggerId },
      pageNumber,
      pageSize,
    );
    const totalCount = await this.postsRepository.getTotalCount({
      bloggerId,
    });
    return pagination(
      pageNumber,
      pageSize,
      totalCount,
      postsForSpecificBlogger,
    );
  }
}
