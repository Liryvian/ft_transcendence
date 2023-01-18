import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../src/typeorm/typeorm.service';
import * as request from 'supertest';
import { CreateMatchmakingRequestDto } from '../src/pong/matchmaking-request/dto/create-matchmaking-request.dto';
import { MatchmakingRequestController } from '../src/pong/matchmaking-request/matchmaking-request.controller';
import { MatchmakingRequest } from '../src/pong/matchmaking-request/entities/matchmaking-request.entity';
import { MatchmakingRequestModule } from '../src/pong/matchmaking-request/matchmaking-request.module';
import { UserModule } from '../src/users/user/user.module';
import { GameModule } from '../src/pong/game/game.module';
import { GameInvite } from '../src/pong/game_invite/entities/game-invite.entity';
import { UserService } from '../src/users/user/user.service';
import { CreateUserDto } from '../src/users/user/dto/create-user.dto';
import { GameInvitesModule } from '../src/pong/game_invite/game-invite.module';
import { User } from '../src/users/user/entities/user.entity';
import { Game } from '../src/pong/game/entities/game.entity';

describe('GameInvite (e2e)', () => {
	let app: INestApplication;
	let matchmakingController: MatchmakingRequestController;
	let userService: UserService;

	const mockInvite: CreateMatchmakingRequestDto = {
		user_id: 2,
	};

	const mockUsers: CreateUserDto[] = [
		{ name: 'Renoster', password: 'R' },
		{ name: 'Flamink', password: 'F' },
	];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([User, GameInvite, MatchmakingRequest, Game]),
				MatchmakingRequestModule,
				UserModule,
				GameInvitesModule,
				GameModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();

		userService = moduleFixture.get<UserService>(UserService);
		matchmakingController = moduleFixture.get<MatchmakingRequestController>(
			MatchmakingRequestController,
		);

		await userService.save(mockUsers);
		await matchmakingController.save(mockInvite);
	});

	afterAll(async () => {
		const allGames: MatchmakingRequest[] =
			await matchmakingController.findAll();

		for (let index = 0; index < allGames.length; index++) {
			await matchmakingController.remove(allGames[index].id);
		}
		app.close();
	});

	describe('matchmaking-requests (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer())
				.get('/matchmaking-requests')
				.expect(HttpStatus.OK);
		});
	});
});
