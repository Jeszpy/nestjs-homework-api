import { Test, TestingModule } from '@nestjs/testing';
import { TestingController } from './testing.controller';
import { TestingService } from './testing.service';

describe('TestingController', () => {
  let controller: TestingController;

  const mockTestingController = {};
  const mockTestingService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestingController],
      providers: [TestingService],
    })
      .overrideProvider(TestingController)
      .useValue(mockTestingController)
      .overrideProvider(TestingService)
      .useValue(mockTestingService)
      .compile();

    controller = module.get<TestingController>(TestingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
