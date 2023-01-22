import { Test, TestingModule } from '@nestjs/testing';
import { AllTestingModule } from '../../shared/test.module';
import { UserAchievementsController } from './user-achievements.controller';
import { UserAchievementsService } from './user-achievements.service';

describe('UserAchievementsController', () => {
	let controller: UserAchievementsController;
	let service: UserAchievementsService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		controller = module.get<UserAchievementsController>(
			UserAchievementsController,
		);
		service = module.get<UserAchievementsService>(UserAchievementsService);
	});

	afterAll(async () => {});

	it('should be defined', () => {
		expect(controller).toBeDefined();
		expect(service).toBeDefined();
	});
});
