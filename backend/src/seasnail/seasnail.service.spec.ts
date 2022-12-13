import { Test, TestingModule } from '@nestjs/testing';
import { SeasnailService } from './seasnail.service';

describe('SeasnailService', () => {
  let service: SeasnailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeasnailService],
    }).compile();

    service = module.get<SeasnailService>(SeasnailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
