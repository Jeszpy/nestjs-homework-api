import { Test, TestingModule } from '@nestjs/testing';
import { EmailRepository } from './email.repository';

describe('EmailService', () => {
  let service: EmailRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailRepository],
    }).compile();

    service = module.get<EmailRepository>(EmailRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
