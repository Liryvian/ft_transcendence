import {
	ArgumentMetadata,
	BadRequestException,
	ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { globalValidationPipeOptions } from '../../main.validationpipe';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UserModule } from '../../users/user/user.module';
import { AuthModule } from '../../auth/auth.module';
import { SharedModule } from '../../shared/shared.module';
import { AnimalModule } from '../../test_example/animal.module';
import { ChatModule } from '../../chats/chat/chat.module';
import { MessageModule } from '../../chats/message/message.module';
import { RoleModule } from '../../chats/role/role.module';
import { GameModule } from './game.module';
import { UserChatModule } from '../../chats/user-chat/user-chat.module';
import { GameInvitesModule } from '../game_invite/game-invite.module';
import { MatchmakingRequestModule } from '../matchmaking-request/matchmaking-request.module';

describe('Game unit tests', () => {
	let service: GameService;
	let controller: GameController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([Game]),
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
			controllers: [GameController],
			providers: [GameService],
		}).compile();

		service = module.get<GameService>(GameService);
		controller = module.get<GameController>(GameController);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});

	describe('CreateGameDto', () => {
		const validator = new ValidationPipe(globalValidationPipeOptions());

		let testObject = {
			player_one: 1,
			player_two: 1,
		};

		const meta: ArgumentMetadata = {
			type: 'body',
			metatype: CreateGameDto,
		};

		it('should throw an error when player 1 & 2 have the same id', async () => {
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw error when player_one is empty', async () => {
			testObject.player_one = null;
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw error when player_two is empty', async () => {
			testObject.player_one = 1;
			testObject.player_two = null;
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe('updateGameDto', () => {
		it('should not throw an error when update object is empty', async () => {
			const validator = new ValidationPipe(globalValidationPipeOptions());
			const testObject = {};

			const meta: ArgumentMetadata = {
				type: 'body',
				metatype: UpdateGameDto,
			};

			expect(await validator.transform(testObject, meta)).toBeTruthy();
		});
	});
});
