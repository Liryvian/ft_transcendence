import { Test, TestingModule } from '@nestjs/testing';
import { AllTestingModule } from '../../shared/test.module';

import { ChatUserPermissionService } from './chat-user-permission.service';

describe('Chat - User - Permission relationship', () => {
	let service: ChatUserPermissionService;
	let testingModule: TestingModule;

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		service = testingModule.get<ChatUserPermissionService>(
			ChatUserPermissionService,
		);
	});

	it('service should be defined', () => {
		expect(service).toBeDefined();
	});
});
