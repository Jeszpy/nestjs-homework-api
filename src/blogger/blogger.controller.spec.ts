import { Test, TestingModule } from '@nestjs/testing';
import { BloggerController } from './blogger.controller';
import { BloggerService } from './blogger.service';
import { BloggerRepository } from './blogger.repository';
import { PostsRepository } from '../posts/posts.repository';
import { PostsService } from '../posts/posts.service';
import mongoose from 'mongoose';
import { BloggerType } from '../types/bloggers';
import { PostType } from '../types/posts';

describe('BloggerController', () => {
  let bloggersModel: mongoose.Model<BloggerType>;
  let postsModel: mongoose.Model<PostType>;
  let bloggersRepository: BloggerRepository;
  let postsRepository: PostsRepository;
  let bloggerService: BloggerService;
  let postsService: PostsService;
  let bloggerController: BloggerController;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   controllers: [BloggerController],
    //   providers: [BloggerService],
    // }).compile();
    // controller = module.get<BloggerController>(BloggerController);
    bloggersRepository = new BloggerRepository(bloggersModel);
    postsRepository = new PostsRepository(postsModel);
    bloggerService = new BloggerService(bloggersRepository, postsRepository);
    postsService = new PostsService();
    bloggerController = new BloggerController(bloggerService, postsService);
  });

  // describe('findAll', () => {
  //   it('should return an array of cats', async () => {
  //     const result = ['test'];
  //     jest.spyOn(bloggerService, 'findAll').mockImplementation(() => result);
  //
  //     expect(await bloggerController.findAll()).toBe(result);
  //   });
  // });

  describe('test', () => {
    it('should create new blogger', async () => {});
  });
});
