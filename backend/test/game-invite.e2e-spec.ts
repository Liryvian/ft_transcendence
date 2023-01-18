import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../src/typeorm/typeorm.service';
import * as request from 'supertest';
import { CreateGameInviteDto } from '../src/pong/game_invite/dto/create-game-invite.dto';
import { GameInvitesController } from '../src/pong/game_invite/game-invite.controller';
import { GameInvite } from '../src/pong/game_invite/entities/game-invite.entity';
import { GameInvitesModule } from '../src/pong/game_invite/game-invite.module';
import { UserModule } from '../src/users/user/user.module';
import { MatchmakingRequest } from '../src/pong/matchmaking-request/entities/matchmaking-request.entity';
import { User } from '../src/users/user/entities/user.entity';
import { Game } from '../src/pong/game/entities/game.entity';
import { Chat } from '../src/chats/chat/entities/chat.entity';

describe('GameInvite (e2e)', () => {
	let app: INestApplication;
	let invitesController: GameInvitesController;

	const mockInvite: CreateGameInviteDto = { players: [1, 2] };

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([
					Game,
					User,
					MatchmakingRequest,
					GameInvite,
					Chat,
				]),
				GameInvitesModule,
				UserModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();

		invitesController = moduleFixture.get<GameInvitesController>(
			GameInvitesController,
		);

		await invitesController.save(mockInvite);
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
