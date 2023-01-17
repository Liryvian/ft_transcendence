import {
	ArgumentMetadata,
	BadRequestException,
	ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { globalValidationPipeOptions } from '../../../src/main.validationpipe';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { CreateGameInviteDto } from './dto/create-game-invite.dto';
import { GameInvite } from './entities/game-invite.entity';
import { GameInvitesController } from './game-invite.controller';
import { GameInvitesService } from './game-invite.service';
import { Game } from '../game/entities/game.entity';
import { MatchmakingRequest } from '../matchmaking-request/entities/matchmaking-request.entity';

describe('GameInvite unit tests', () => {
	let service: GameInvitesService;
	let controller: GameInvitesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([GameInvite, User, Game, MatchmakingRequest]),
			],
			providers: [GameInvitesService],
			controllers: [GameInvitesController],
		}).compile();

		service = module.get<GameInvitesService>(GameInvitesService);
		controller = module.get<GameInvitesController>(GameInvitesController);
	});

	it('should be defined, service and controller', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});

	describe('CreateGameInviteDto', () => {
		const validator = new ValidationPipe(globalValidationPipeOptions());

		let testObject = {
			source_id: 1,
			target_id: 1,
		};

		const meta: ArgumentMetadata = {
			type: 'body',
			metatype: CreateGameInviteDto,
		};

		it('should throw an error when source and target have the same id', async () => {
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw error when source_id is empty', async () => {
			testObject.source_id = null;
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw error when source_id is NaN', async () => {
			let NaNtestObject = {
				source_id: '1',
				target_id: 1,
			};
			await expect(validator.transform(NaNtestObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw error when target_id is empty', async () => {
			testObject.source_id = 1;
			testObject.target_id = null;
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw error when target_id is NaN', async () => {
			let NaNtestObject = {
				source_id: 1,
				target_id: '1',
			};
			await expect(validator.transform(NaNtestObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});
	});
});
