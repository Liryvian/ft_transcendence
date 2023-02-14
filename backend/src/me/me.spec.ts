import { Test, TestingModule } from '@nestjs/testing';
import { MeController } from './me.controller';
import { INestApplication } from '@nestjs/common';
import { AllTestingModule } from '../shared/test.module';

describe('MeController', () => {
	let app: INestApplication;
	let controller: MeController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		app = module.createNestApplication();
		controller = module.get<MeController>(MeController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
