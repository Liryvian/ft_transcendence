import { Test, TestingModule } from '@nestjs/testing';
import { MatchmakingRequestService } from './matchmaking-request.service';

describe('MatchmakingRequestService', () => {
  let service: MatchmakingRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchmakingRequestService],
    }).compile();

    service = module.get<MatchmakingRequestService>(MatchmakingRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
