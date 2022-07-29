import { Test, TestingModule } from '@nestjs/testing';
import { JWTService } from './jwt.service';

describe('JwtService', () => {
  let service: JWTService;

  const mockJWTService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JWTService],
    })
      .overrideProvider(JWTService)
      .useValue(mockJWTService)
      .compile();

    service = module.get<JWTService>(JWTService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
