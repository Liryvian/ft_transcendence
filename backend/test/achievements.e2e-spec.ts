import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AllTestingModule } from '../src/shared/test.module';
import { AchievementsController } from '../src/users/achievements/achievements.controller';
import { AchievementsService } from '../src/users/achievements/achievements.service';

describe('AppController (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
			controllers: [AchievementsController],
			providers: [AchievementsService],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		app.close();
	});

	it('/achievements (GET)', () => {
		return request(app.getHttpServer()).get('/achievements').expect(200);
	});
});
