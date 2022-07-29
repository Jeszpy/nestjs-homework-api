import { Test, TestingModule } from '@nestjs/testing';
import { TestingService } from './testing.service';

describe('TestingService', () => {
  let service: TestingService;

  const mockTestingService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestingService],
    })
      .overrideProvider(TestingService)
      .useValue(mockTestingService)
      .compile();

    service = module.get<TestingService>(TestingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
