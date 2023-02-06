import { Module } from '@nestjs/common';
import { AuthModule } from '../../src/auth/auth.module';
import { ChatModule } from '../../src/chats/chat/chat.module';
import { MessageModule } from '../../src/chats/message/message.module';
import { GameModule } from '../../src/pong/game/game.module';
import { GameInvitesModule } from '../../src/pong/game_invite/game-invite.module';
import { MatchmakingRequestModule } from '../../src/pong/matchmaking-request/matchmaking-request.module';
import { SharedModule } from '../../src/shared/shared.module';
import { AchievementsModule } from '../../src/users/achievements/achievements.module';
import { UserAchievementsModule } from '../../src/users/user-achievements/user-achievements.module';
import { UserRelationshipModule } from '../../src/users/user-relationship/user-relationship.module';
import { UserController } from '../../src/users/user/user.controller';
import { UserModule } from '../../src/users/user/user.module';
import { AnimalModule } from '../test_example/animal.module';
import { SeederService } from './seeders.service';

@Module({
	imports: [
		AnimalModule,
		AuthModule,
		SharedModule,
		ChatModule,
		MessageModule,
		UserModule,
		GameModule,
		GameInvitesModule,
		MatchmakingRequestModule,
		SeedersModule,
		UserRelationshipModule,
		AchievementsModule,
		UserAchievementsModule,
	],
	providers: [SeederService],
	controllers: [UserController],
})
export class SeedersModule {}
