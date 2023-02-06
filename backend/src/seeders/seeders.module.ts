import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chats/chat/chat.module';
import { MessageModule } from '../chats/message/message.module';
import { GameModule } from '../pong/game/game.module';
import { GameInvitesModule } from '../pong/game_invite/game-invite.module';
import { MatchmakingRequestModule } from '../pong/matchmaking-request/matchmaking-request.module';
import { SharedModule } from '../shared/shared.module';
import { AchievementsModule } from '../users/achievements/achievements.module';
import { UserAchievementsModule } from '../users/user-achievements/user-achievements.module';
import { UserRelationshipModule } from '../users/user-relationship/user-relationship.module';
import { UserController } from '../users/user/user.controller';
import { UserModule } from '../users/user/user.module';
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
		UserRelationshipModule,
		AchievementsModule,
		UserAchievementsModule,
	],
	providers: [SeederService],
	controllers: [UserController],
})
export class SeedersModule {}
