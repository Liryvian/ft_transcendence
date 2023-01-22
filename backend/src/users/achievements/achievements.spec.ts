import { Test, TestingModule } from '@nestjs/testing';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';

describe('AchievementsService', () => {
  let service: AchievementsService;
  let controller: AchievementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchievementsService],
    }).compile();

    service = module.get<AchievementsService>(AchievementsService);
    controller = module.get<AchievementsController>(AchievementsController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
