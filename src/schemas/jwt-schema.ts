import * as mongoose from 'mongoose';
import { RefreshTokenType } from '../types/jwt';

export const jwtSchema = new mongoose.Schema<RefreshTokenType>({
  refreshToken: { type: String, required: true },
  blocked: { type: Boolean, default: false },
});
