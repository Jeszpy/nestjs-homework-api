import mongoose from 'mongoose';
import { BloggerType } from '../types/bloggers';

export const bloggersSchema = new mongoose.Schema<BloggerType>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
});
