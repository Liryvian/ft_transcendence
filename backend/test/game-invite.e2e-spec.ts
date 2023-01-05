import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../src/typeorm/typeorm.service';
import * as request from 'supertest';
import { CreateGameInviteDto } from 'backend/src/pong/game_invite/dto/create-game-invite.dto';
import { GameInvitesController } from 'backend/src/pong/game_invite/game-invite.controller';
import { GameInvite } from 'backend/src/pong/game_invite/entities/game-invite.entity';
import { GameInvitesModule } from 'backend/src/pong/game_invite/game-invite.module';

describe('GameInvite (e2e)', () => {
	let app: INestApplication;
	let invitesController: GameInvitesController;

	const mockInvite: CreateGameInviteDto = { source_id: 1, target_id: 2 };

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				GameInvitesModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();

		invitesController = moduleFixture.get<GameInvitesController>(GameInvitesController);

		await invitesController.create(mockInvite);
	});

	afterAll(async () => {
		const allGames: GameInvite[] = await invitesController.findAll();

		for (let index = 0; index < allGames.length; index++) {
			await invitesController.remove(allGames[index].id);
		}
		app.close();
	});

	describe('/games (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer()).get('/games').expect(HttpStatus.OK);
		});
	});
});
