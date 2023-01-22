import { Test, TestingModule } from '@nestjs/testing';
import { AllTestingModule } from '../../shared/test.module';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';

describe('AchievementsService', () => {
	let service: AchievementsService;
	let controller: AchievementsController;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		service = module.get<AchievementsService>(AchievementsService);
		controller = module.get<AchievementsController>(AchievementsController);
	});

	afterAll(async () => {});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});
});
