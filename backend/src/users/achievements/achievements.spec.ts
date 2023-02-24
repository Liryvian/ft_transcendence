import { Test, TestingModule } from '@nestjs/testing';
import { AllTestingModule } from '../../shared/test.module';
import { AchievementsService } from './achievements.service';

describe('AchievementsService', () => {
	let service: AchievementsService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		service = module.get<AchievementsService>(AchievementsService);
	});

	afterAll(async () => {});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
