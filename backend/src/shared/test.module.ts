import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../chats/chat/entities/chat.entity';
import { Message } from '../chats/message/entities/message.entity';
import { Role } from '../chats/role/entities/role.entity';
import { UserChat } from '../chats/user-chat/entities/user-chat.entity';
import { Game } from '../pong/game/entities/game.entity';
import { GameInvite } from '../pong/game_invite/entities/game-invite.entity';
import { MatchmakingRequest } from '../pong/matchmaking-request/entities/matchmaking-request.entity';
import { TypeOrmTestConfigService } from '../typeorm/typeorm-testing.service';
import { User } from '../users/user/entities/user.entity';
import { SharedModule } from './shared.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user/user.module';
import { MatchmakingRequestModule } from '../pong/matchmaking-request/matchmaking-request.module';
import { GameInvitesModule } from '../pong/game_invite/game-invite.module';
import { ChatModule } from '../chats/chat/chat.module';
import { UserChatModule } from '../chats/user-chat/user-chat.module';
import { GameModule } from '../pong/game/game.module';
import { MessageModule } from '../chats/message/message.module';
import { RoleModule } from '../chats/role/role.module';
import { SeedersModule } from '../seeders/seeders.module';
import { UserRelationship } from '../users/user-relationship/entities/user-relationship.entity';
import { UserRelationshipModule } from '../users/user-relationship/user-relationship.module';
import { AchievementsModule } from '../users/achievements/achievements.module';
import { Achievement } from '../users/achievements/entities/achievement.entity';
import { UserAchievement } from '../users/user-achievements/entities/user-achievement.entity';
import { UserAchievementsModule } from '../users/user-achievements/user-achievements.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({ useClass: TypeOrmTestConfigService }),
		TypeOrmModule.forFeature([
			Chat,
			Game,
			GameInvite,
			MatchmakingRequest,
			Message,
			Role,
			User,
			UserChat,
			UserRelationship,
			Achievement,
			UserAchievement,
		]),
		SharedModule,
		AuthModule,

		GameModule,
		GameInvitesModule,
		MatchmakingRequestModule,

		ChatModule,
		MessageModule,
		RoleModule,
		UserChatModule,

		UserModule,
		SeedersModule,

		UserRelationshipModule,
		AchievementsModule,
		UserAchievementsModule,
	],
})
export class AllTestingModule {}
