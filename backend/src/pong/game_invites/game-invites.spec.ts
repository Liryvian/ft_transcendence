import { Test, TestingModule } from '@nestjs/testing';
import { GameInvitesController } from './game-invites.controller';
import { GameInvitesService } from './game-invites.service';

describe('GameInvitesService', () => {
	let service: GameInvitesService;
	let controller: GameInvitesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [GameInvitesService],
		}).compile();

		service = module.get<GameInvitesService>(GameInvitesService);
		controller = module.get<GameInvitesController>(GameInvitesController);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});
});
