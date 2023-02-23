import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MessageController } from '../src/chats/message/message.controller';
import { AllTestingModule } from '../src/shared/test.module';
import { AuthGuard } from '../src/auth/auth.guard';

describe('message e2e', () => {
	let testingModule: TestingModule;
	let app: INestApplication;
	let messageController: MessageController;

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

		messageController = testingModule.get<MessageController>(MessageController);
	});

	describe('/messages (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer())
				.get('/messages')
				.expect(HttpStatus.OK);
		});
	});
});
