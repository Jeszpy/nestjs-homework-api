import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilterQuery } from 'mongoose';
import { PostType } from '../types/posts';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BloggerType } from '../types/bloggers';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel('Posts') private postsModel: mongoose.Model<PostType>,
  ) {}

  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  async getAllPosts(
    searchNameTerm: FilterQuery<PostType>,
    pageNumber: number,
    pageSize: number,
  ): Promise<PostType[]> {
    const posts = await this.postsModel
      .find(searchNameTerm, {
        _id: false,
        __v: false,
      })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    return posts;
  }

  async getAllPostsByBloggerId(
    bloggerId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PostType[]> {
    const posts = await this.postsModel
      .find(
        { bloggerId },
        {
          _id: false,
          __v: false,
        },
      )
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    return posts;
  }

  async getTotalCount(filter: FilterQuery<PostType>): Promise<number> {
    return this.postsModel.countDocuments(filter);
  }
}
