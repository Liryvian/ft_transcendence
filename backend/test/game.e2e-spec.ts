import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateGameDto } from '../src/pong/game/dto/create-game.dto';
import { Game } from '../src/pong/game/entities/game.entity';
import { GameController } from '../src/pong/game/game.controller';
import { GameModule } from '../src/pong/game/game.module';
import { TypeOrmConfigService } from '../src/typeorm/typeorm.service';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { ChatModule } from '../src/chats/chat/chat.module';
import { GameInvite } from '../src/pong/game_invite/entities/game-invite.entity';
import { GameInvitesModule } from '../src/pong/game_invite/game-invite.module';
import { globalValidationPipeOptions } from '../../backend/src/main.validationpipe';
import { MatchmakingRequest } from '../src/pong/matchmaking-request/entities/matchmaking-request.entity';
import { MatchmakingRequestModule } from '../src/pong/matchmaking-request/matchmaking-request.module';
import { MessageModule } from '../src/chats/message/message.module';
import { RoleModule } from '../src/chats/role/role.module';
import { SharedModule } from '../src/shared/shared.module';
import { User } from '../src/users/user/entities/user.entity';
import { UserChatModule } from '../src/chats/user-chat/user-chat.module';
import { UserModule } from '../src/users/user/user.module';

describe('Game (e2e)', () => {
	let app: INestApplication;
	let gameController: GameController;

	const mockGame: CreateGameDto = { player_one: 1, player_two: 2 };

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([Game, User, MatchmakingRequest, GameInvite]),
				AuthModule,
				ChatModule,
				GameInvite,
				GameInvitesModule,
				GameModule,
				MatchmakingRequestModule,
				MessageModule,
				RoleModule,
				SharedModule,
				UserChatModule,
				UserModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
		await app.init();

		gameController = moduleFixture.get<GameController>(GameController);

		await gameController.save(mockGame);
	});

	afterAll(async () => {
		const allGames: Game[] = await gameController.findAll();

		for (let index = 0; index < allGames.length; index++) {
			await gameController.remove(allGames[index].id);
		}
		app.close();
	});

	describe('/games (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer()).get('/games').expect(HttpStatus.OK);
		});
	});
});
