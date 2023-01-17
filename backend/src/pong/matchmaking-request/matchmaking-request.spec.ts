import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { MatchmakingRequest } from './entities/matchmaking-request.entity';
import { MatchmakingRequestController } from './matchmaking-request.controller';
import { MatchmakingRequestService } from './matchmaking-request.service';
import { UserModule } from '../../users/user/user.module';
import { AuthModule } from '../../auth/auth.module';
import { SharedModule } from '../../shared/shared.module';
import { AnimalModule } from '../../test_example/animal.module';
import { ChatModule } from '../../chats/chat/chat.module';
import { MessageModule } from '../../chats/message/message.module';
import { RoleModule } from '../../chats/role/role.module';
import { GameModule } from '../game/game.module';
import { UserChatModule } from '../../chats/user-chat/user-chat.module';
import { GameInvitesModule } from '../game_invite/game-invite.module';
import { MatchmakingRequestModule } from './matchmaking-request.module';

describe('MatchmakingRequestService', () => {
	let service: MatchmakingRequestService;
	let controller: MatchmakingRequestController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([MatchmakingRequest]),
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
			providers: [MatchmakingRequestService],
			controllers: [MatchmakingRequestController],
		}).compile();

		service = module.get<MatchmakingRequestService>(MatchmakingRequestService);
		controller = module.get<MatchmakingRequestController>(
			MatchmakingRequestController,
		);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});
});
