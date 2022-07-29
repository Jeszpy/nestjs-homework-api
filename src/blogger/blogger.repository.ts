import { Injectable } from '@nestjs/common';
import { CreateBloggerDto } from './dto/create-blogger.dto';
import { UpdateBloggerDto } from './dto/update-blogger.dto';
import { BloggerType } from '../types/bloggers';
import { FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Injectable()
export class BloggerRepository {
  constructor(
    @InjectModel('Bloggers') private bloggersModel: mongoose.Model<BloggerType>,
  ) {}
  create(createBloggerDto: CreateBloggerDto) {
    return 'This action adds a new blogger';
  }

  async findAll(
    searchNameTerm: FilterQuery<BloggerType>,
    pageNumber: number,
    pageSize: number,
  ): Promise<BloggerType[]> {
    return this.bloggersModel
      .find(
        { name: { $regex: searchNameTerm ? searchNameTerm : '' } },
        { _id: false, __v: false },
      )
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();
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

  async getTotalCount(filter: FilterQuery<BloggerType>): Promise<number> {
    return this.bloggersModel.countDocuments(filter);
  }
}
