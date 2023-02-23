import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthGuard } from '../src/auth/auth.guard';
import { AllTestingModule } from '../src/shared/test.module';

describe('UserRelationship (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		})
			.overrideGuard(AuthGuard)
			.useValue({ validated: true })
			.compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();
	});

	afterAll(async () => {
		app.close();
	});

	describe('/user-relationships (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer())
				.get('/user-relationships')
				.expect(HttpStatus.OK);
		});
	});
});
