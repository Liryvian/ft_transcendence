import { Test, TestingModule } from '@nestjs/testing';
import { ChatMembershipController } from './chat-membership.controller';
import { ChatMembershipService } from './chat-membership.service';

describe('ChatMembershipController', () => {
	let controller: ChatMembershipController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ChatMembershipController],
			providers: [ChatMembershipService],
		}).compile();

		controller = module.get<ChatMembershipController>(ChatMembershipController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
