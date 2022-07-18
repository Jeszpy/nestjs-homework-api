import * as mongoose from 'mongoose';
import { CommentsType } from '../types/comments';

export const commentsSchema = new mongoose.Schema<CommentsType>({
  id: { type: String, required: true },
  postId: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
});
