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
import { UserController } from '../src/users/user/user.controller';
import { RegisterUserDto } from '../src/users/user/dto/register-user.dto';

describe('Game (e2e)', () => {
	let app: INestApplication;
	let gameController: GameController;
	let userController: UserController;

	// Setting id's below
	const mockGame: CreateGameDto = { player_one: 0, player_two: 0 };
	const mockUsers: RegisterUserDto[] = [
		{ name: 'Galjoen', password: 'G', password_confirm: 'G' },
		{ name: 'Worshond', password: 'W', password_confirm: 'W' },
	];

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
		userController = moduleFixture.get<UserController>(UserController);

		for (let i = 0; i < mockUsers.length; i++) {
			await userController.create(mockUsers[i]);
		}
		const allUsers: User[] = await userController.findAll();
		mockGame.player_one = allUsers[0].id;
		mockGame.player_two = allUsers[1].id;
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
