import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshTokenType } from '../types/jwt';
import mongoose from 'mongoose';

@Injectable()
export class JwtRepository {
  constructor(
    @InjectModel('Jwt') private jwtModel: mongoose.Model<RefreshTokenType>,
  ) {}

  async saveRefreshToken(refreshToken: string): Promise<void> {
    await this.jwtModel.create({ refreshToken });
  }

  async getRefreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenType | null> {
    return this.jwtModel.findOne({ refreshToken });
  }

  async blockOldRefreshToken(oldRefreshToken: string): Promise<boolean> {
    const block = await this.jwtModel.updateOne(
      { refreshToken: oldRefreshToken },
      { $set: { blocked: true } },
    );
    return block.modifiedCount === 1;
  }
}
