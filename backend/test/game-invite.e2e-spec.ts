import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateGameInviteDto } from '../src/pong/game_invite/dto/create-game-invite.dto';
import { GameInvitesController } from '../src/pong/game_invite/game-invite.controller';
import { GameInvite } from '../src/pong/game_invite/entities/game-invite.entity';
import { AllTestingModule } from '../src/shared/test.module';
import { AuthGuard } from '../src/auth/auth.guard';

describe('GameInvite (e2e)', () => {
	let app: INestApplication;
	let invitesController: GameInvitesController;

	const mockInvite: CreateGameInviteDto = { players: [1, 2] };

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

		invitesController = moduleFixture.get<GameInvitesController>(
			GameInvitesController,
		);

		await invitesController.create(mockInvite);
	});

	afterAll(async () => {
		const allGames: GameInvite[] = await invitesController.findAll();

		for (let index = 0; index < allGames.length; index++) {
			await invitesController.remove(allGames[index].id);
		}
		app.close();
	});

	describe('/game-invites (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer())
				.get('/game-invites')
				.expect(HttpStatus.OK);
		});
	});
});
