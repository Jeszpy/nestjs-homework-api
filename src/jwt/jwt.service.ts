import { Injectable } from '@nestjs/common';
import { AccessAndRefreshTokenType, RefreshTokenType } from '../types/jwt';
import { randomUUID } from 'crypto';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../user/user.repository';
import { JwtRepository } from './jwt.repository';
import { ConfigService } from '@nestjs/config';
import { constants } from '../constants';

@Injectable()
export class JWTService {
  constructor(
    private usersRepository: UserRepository,
    private jwtRepository: JwtRepository,
    private configService: ConfigService,
  ) {}

  jwtSecret = this.configService.get(constants.JWT_SECRET);
  accessTokenExpiresIn = this.configService.get(
    constants.ACCESS_TOKEN_EXPIRES_IN,
  );
  refreshTokenExpiresIn = this.configService.get(
    constants.REFRESH_TOKEN_EXPIRES_IN,
  );

  async verifyJwt(token: RefreshTokenType | null): Promise<string | null> {
    if (!token) return null;
    if (token.blocked) return null;
    try {
      jwt.verify(token.refreshToken, this.jwtSecret);
    } catch (e) {
      return null;
    }
    return token.refreshToken;
  }

  async createJWT(
    login: string,
    password: string,
  ): Promise<AccessAndRefreshTokenType | null> {
    const user = await this.usersRepository.getOneUserForJWT(login);
    if (!user) return null;
    try {
      const verify = await argon2.verify(user.password, password);
      if (!verify) return null;
      const accessToken = jwt.sign({ userId: user.id }, this.jwtSecret, {
        expiresIn: this.accessTokenExpiresIn,
      });
      const refreshToken = jwt.sign({ userId: user.id }, this.jwtSecret, {
        expiresIn: this.refreshTokenExpiresIn,
      });
      await this.jwtRepository.saveRefreshToken(refreshToken);
      return { accessToken, refreshToken };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getUserIdByToken(token: string): Promise<string | null> {
    try {
      const result: any = await jwt.verify(
        token,
        this.configService.get(constants.JWT_SECRET),
      );
      return result.userId;
    } catch (e) {
      return null;
    }
  }

  async blockOldRefreshToken(oldRefreshToken: string): Promise<boolean | null> {
    try {
      jwt.verify(oldRefreshToken, this.configService.get(constants.JWT_SECRET));
    } catch (e) {
      return null;
    }
    const token = await this.jwtRepository.getRefreshToken(oldRefreshToken);
    if (!token) return null;
    if (token.blocked) return null;
    return this.jwtRepository.blockOldRefreshToken(oldRefreshToken);
  }

  async getNewRefreshToken(
    refreshToken: string,
  ): Promise<AccessAndRefreshTokenType | null> {
    const jwtSecret = this.configService.get(constants.JWT_SECRET);
    const token = await this.jwtRepository.getRefreshToken(refreshToken);
    const oldRefreshToken = await this.verifyJwt(token);
    if (!oldRefreshToken) return null;
    await this.jwtRepository.blockOldRefreshToken(oldRefreshToken);
    const userInfo: any = jwt.decode(oldRefreshToken);
    const userId: string = userInfo.userId;
    const payload = {
      jwtId: randomUUID(),
      userId,
    };
    const accessToken = jwt.sign(payload, jwtSecret, {
      expiresIn: this.configService.get(constants.ACCESS_TOKEN_EXPIRES_IN),
    });
    const newRefreshToken = jwt.sign(payload, jwtSecret, {
      expiresIn: this.configService.get(constants.REFRESH_TOKEN_EXPIRES_IN),
    });
    await this.jwtRepository.saveRefreshToken(newRefreshToken);
    return { accessToken, refreshToken: newRefreshToken };
  }
}

export interface IJwtRepository {
  saveRefreshToken(refreshToken: string): Promise<void>;

  getRefreshToken(refreshToken: string): Promise<RefreshTokenType | null>;

  blockOldRefreshToken(refreshToken: string): Promise<boolean>;
}
