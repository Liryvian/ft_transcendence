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
import { UserModule } from '../src/user/user.module';
import { GameModule } from '../src/pong/game/game.module';

describe('GameInvite (e2e)', () => {
	let app: INestApplication;
	let matchmakingController: MatchmakingRequestController;

	const mockInvite: CreateMatchmakingRequestDto = {
		user_id: 1,
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				MatchmakingRequestModule,
				UserModule,
				GameModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();

		matchmakingController = moduleFixture.get<MatchmakingRequestController>(
			MatchmakingRequestController,
		);

		await matchmakingController.create(mockInvite);
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
