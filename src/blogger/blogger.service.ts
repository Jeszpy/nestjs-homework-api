import { Injectable } from '@nestjs/common';
import { CreateBloggerDto } from './dto/create-blogger.dto';
import { UpdateBloggerDto } from './dto/update-blogger.dto';
import { BloggerRepository } from './blogger.repository';
import { BloggerType } from '../types/bloggers';
import {
  pagination,
  PaginationResultType,
} from '../helpers/pagination/pagination';

@Injectable()
export class BloggerService {
  constructor(private readonly bloggersRepository: BloggerRepository) {}
  create(createBloggerDto: CreateBloggerDto) {
    return 'This action adds a new blogger';
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

  findOne(bloggerId: string) {
    return `This action returns a #${bloggerId} blogger`;
  }

  update(bloggerId: string, updateBloggerDto: UpdateBloggerDto) {
    return `This action updates a #${bloggerId} blogger`;
  }

  remove(bloggerId: string) {
    return `This action removes a #${bloggerId} blogger`;
  }
}
