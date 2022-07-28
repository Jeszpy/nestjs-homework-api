import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTService } from '../jwt/jwt.service';
import { UserService } from '../user/user.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {};
  const mockJWTService = {};
  const mockUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, JWTService, UserService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(JWTService)
      .useValue(mockJWTService)
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
