import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserAccountDBType } from '../types/user';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('User') private userModel: mongoose.Model<UserAccountDBType>,
  ) {}
}
