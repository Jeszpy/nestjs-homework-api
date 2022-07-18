import * as mongoose from 'mongoose';
import { EmailType } from '../types/emails';

export const emailSchema = new mongoose.Schema<EmailType>({
  id: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  userLogin: { type: String, required: true },
  confirmationCode: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
