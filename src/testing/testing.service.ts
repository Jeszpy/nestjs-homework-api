import { Injectable } from '@nestjs/common';
import { usersSchema } from '../schemas/users-schema';
import { bloggersSchema } from '../schemas/bloggers-schema';
import { postsSchema } from '../schemas/posts-schema';
import { commentsSchema } from '../schemas/comments-schema';
import { emailSchema } from '../schemas/emails-schema';
import { jwtSchema } from '../schemas/jwt-schema';
import { connectionsLimitsSchema } from '../schemas/connections-limits-schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserAccountDBType } from '../types/user';
import { BloggerType } from '../types/bloggers';
import { PostType } from '../types/posts';
import { CommentsType } from '../types/comments';
import { EmailType } from '../types/emails';
import { RefreshTokenType } from '../types/jwt';
import { ConnectionLimitsType } from '../types/connectionLimits';

@Injectable()
export class TestingService {
  constructor(
    @InjectModel('Users') private usersModel: mongoose.Model<UserAccountDBType>,
    @InjectModel('Bloggers') private bloggersModel: mongoose.Model<BloggerType>,
    @InjectModel('Posts') private postsModel: mongoose.Model<PostType>,
    @InjectModel('Comments')
    private commentsModel: mongoose.Model<CommentsType>,
    @InjectModel('Emails') private emailsModel: mongoose.Model<EmailType>,
    @InjectModel('RefreshTokens')
    private refreshTokensModel: mongoose.Model<RefreshTokenType>,
    @InjectModel('ConnectionsLimits')
    private connectionsLimitsModel: mongoose.Model<ConnectionLimitsType>,
  ) {}

  async wipeAllData() {
    await this.usersModel.deleteMany({});
    await this.bloggersModel.deleteMany({});
    await this.postsModel.deleteMany({});
    await this.commentsModel.deleteMany({});
    await this.emailsModel.deleteMany({});
    await this.refreshTokensModel.deleteMany({});
    await this.connectionsLimitsModel.deleteMany({});
  }
}
