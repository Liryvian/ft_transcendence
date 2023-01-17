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
import { globalValidationPipeOptions } from '../../backend/src/main.validationpipe';
import {UserModule} from "../src/users/user/user.module";
import {AuthModule} from "../src/auth/auth.module";
import {SharedModule} from "../src/shared/shared.module";
import {AnimalModule} from "../src/test_example/animal.module";
import {ChatModule} from "../src/chats/chat/chat.module";
import {MessageModule} from "../src/chats/message/message.module";
import {RoleModule} from "../src/chats/role/role.module";
import {UserChatModule} from "../src/chats/user-chat/user-chat.module";
import {GameInvitesModule} from "../src/pong/game_invite/game-invite.module";
import {MatchmakingRequestModule} from "../src/pong/matchmaking-request/matchmaking-request.module";

describe('Game (e2e)', () => {
	let app: INestApplication;
	let gameController: GameController;

	const mockGame: CreateGameDto = { player_one: 1, player_two: 2 };

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				UserModule,
				AuthModule,
				SharedModule,
				AnimalModule,
				ChatModule,
				MessageModule,
				UserModule,
				RoleModule,
				GameModule,
				UserChatModule,
				GameInvitesModule,
				MatchmakingRequestModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
		await app.init();

		gameController = moduleFixture.get<GameController>(GameController);

		await gameController.create(mockGame);
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
