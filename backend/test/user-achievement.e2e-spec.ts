import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AllTestingModule } from '../src/shared/test.module';
import AuthGuard from '../src/auth/auth.guard';

describe('user-achievements e2e', () => {
	let testingModule: TestingModule;
	let app: INestApplication;

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		})
			.overrideGuard(AuthGuard)
			.useValue({ validated: true })
			.compile();

		app = testingModule.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	describe('/user-achievements (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer())
				.get('/user-achievements')
				.expect(HttpStatus.OK);
		});
	});
});
