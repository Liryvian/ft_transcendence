import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmTestConfigService } from '../typeorm/typeorm-testing.service';

import { SharedModule } from './shared.module';
import { AuthModule } from '../auth/auth.module';
import { SeedersModule } from '../seeders/seeders.module';

import { Achievement } from '../users/achievements/entities/achievement.entity';
import { AchievementsModule } from '../users/achievements/achievements.module';

import { Chat } from '../chats/chat/entities/chat.entity';
import { ChatModule } from '../chats/chat/chat.module';
import { ChatUserPermission } from '../chats/chat-user-permissions/entities/chat-user-permission.entity';
import { ChatUserPermissionModule } from '../chats/chat-user-permissions/chat-user-permission.module';

import { Game } from '../pong/game/entities/game.entity';
import { GameInvite } from '../pong/game_invite/entities/game-invite.entity';
import { GameInvitesModule } from '../pong/game_invite/game-invite.module';
import { GameModule } from '../pong/game/game.module';

import { MatchmakingRequest } from '../pong/matchmaking-request/entities/matchmaking-request.entity';
import { MatchmakingRequestModule } from '../pong/matchmaking-request/matchmaking-request.module';
import { Message } from '../chats/message/entities/message.entity';
import { MessageModule } from '../chats/message/message.module';

import { User } from '../users/user/entities/user.entity';
import { UserAchievement } from '../users/user-achievements/entities/user-achievement.entity';
import { UserAchievementsModule } from '../users/user-achievements/user-achievements.module';

import { UserModule } from '../users/user/user.module';
import { UserRelationship } from '../users/user-relationship/entities/user-relationship.entity';
import { UserRelationshipModule } from '../users/user-relationship/user-relationship.module';
import { MeModule } from '../me/me.module';

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
			User,
			UserRelationship,
			Achievement,
			UserAchievement,
			ChatUserPermission,
		]),
		SharedModule,
		AuthModule,
		MeModule,

		GameModule,
		GameInvitesModule,
		MatchmakingRequestModule,

		ChatModule,
		MessageModule,
		ChatUserPermissionModule,

		UserModule,
		SeedersModule,

		UserRelationshipModule,
		AchievementsModule,
		UserAchievementsModule,
	],
})
export class AllTestingModule {}
