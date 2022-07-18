import * as mongoose from 'mongoose';
import { PostType } from '../types/posts';

export const postsSchema = new mongoose.Schema<PostType>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  bloggerId: { type: String, required: true },
});
