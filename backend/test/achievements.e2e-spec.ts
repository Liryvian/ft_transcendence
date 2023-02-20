import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AllTestingModule } from '../src/shared/test.module';
import { AchievementsModule } from '../src/users/achievements/achievements.module';

describe('AppController (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule, AchievementsModule],
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
