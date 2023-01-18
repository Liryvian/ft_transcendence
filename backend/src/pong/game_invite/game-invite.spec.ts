import {
	ArgumentMetadata,
	BadRequestException,
	ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/user/entities/user.entity';
import { globalValidationPipeOptions } from '../../../src/main.validationpipe';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { CreateGameInviteDto } from './dto/create-game-invite.dto';
import { GameInvite } from './entities/game-invite.entity';
import { GameInvitesController } from './game-invite.controller';
import { GameInvitesService } from './game-invite.service';
import { Game } from '../game/entities/game.entity';
import { MatchmakingRequest } from '../matchmaking-request/entities/matchmaking-request.entity';
import { UserModule } from '../../users/user/user.module';
import { AuthModule } from '../../auth/auth.module';
import { SharedModule } from '../../shared/shared.module';
import { ChatModule } from '../../chats/chat/chat.module';
import { MessageModule } from '../../chats/message/message.module';
import { RoleModule } from '../../chats/role/role.module';
import { GameModule } from '../game/game.module';
import { UserChatModule } from '../../chats/user-chat/user-chat.module';
import { GameInvitesModule } from './game-invite.module';
import { MatchmakingRequestModule } from '../matchmaking-request/matchmaking-request.module';

describe('GameInvite unit tests', () => {
	let service: GameInvitesService;
	let controller: GameInvitesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([GameInvite, User, Game, MatchmakingRequest]),
				AuthModule,
				ChatModule,
				GameInvitesModule,
				GameModule,
				MatchmakingRequestModule,
				MessageModule,
				RoleModule,
				SharedModule,
				UserChatModule,
				UserModule,
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
			players: [1, 1],
		};

		const meta: ArgumentMetadata = {
			type: 'body',
			metatype: CreateGameInviteDto,
		};

		it('should work when initting with an array', async () => {
			let ObjectToTransform = {
				players: [1, 2],
			};
			let expectedObj: CreateGameInviteDto = {
				players: [1, 2],
			};
			validator.transform(ObjectToTransform, meta);
			expect(ObjectToTransform).toEqual(expectedObj);
		});

		it('should throw an error when source and target have the same id', async () => {
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw error when source_id is empty', async () => {
			testObject.players[0] = null;
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw error when source_id is NaN', async () => {
			let NaNtestObject = {
				players: ['1', 1],
			};
			await expect(validator.transform(NaNtestObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw error when target_id is empty', async () => {
			testObject.players[0] = 1;
			testObject.players[1] = null;
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw error when target_id is NaN', async () => {
			let NaNtestObject = {
				players: [1, '1'],
			};
			await expect(validator.transform(NaNtestObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});
	});
});
