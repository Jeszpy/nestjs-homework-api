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
  async create(createBloggerDto: CreateBloggerDto) {
    return this.bloggersModel.create(createBloggerDto);
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

  findOneById(bloggerId: string) {
    return this.bloggersModel
      .findOne({ id: bloggerId }, { _id: false, __v: false })
      .lean();
  }

  async update(bloggerId: string, updateBloggerDto: UpdateBloggerDto) {
    try {
      await this.bloggersModel.updateOne(
        { id: bloggerId },
        {
          $set: {
            name: updateBloggerDto.name,
            youtubeUrl: updateBloggerDto.youtubeUrl,
          },
        },
      );
      return true;
    } catch (e) {
      return null;
    }
  }

  async removeById(bloggerId: string) {
    try {
      await this.bloggersModel.deleteOne({ id: bloggerId });
      return true;
    } catch (e) {
      return null;
    }
  }

  async getTotalCount(filter: FilterQuery<BloggerType>): Promise<number> {
    return this.bloggersModel.countDocuments(
      filter ? { name: { $regex: filter } } : filter,
    );
  }
}
