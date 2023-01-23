import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

import { AllTestingModule } from '../shared/test.module';

describe('Auth', () => {
	let authController: AuthController;
	let authService: AuthService;
	let authGuard: AuthGuard;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		authController = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(AuthService);
		authGuard = module.get<AuthGuard>(AuthGuard);
	});

	afterAll(() => {});

	describe('Auth-Guard/Controller/Service', () => {
		it('should be defined', () => {
			expect(authGuard).toBeDefined();
			expect(authController).toBeDefined();
			expect(authService).toBeDefined();
		});
	});
});
