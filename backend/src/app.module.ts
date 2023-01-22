import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm/typeorm.service';
import { ChatModule } from './chats/chat/chat.module';
import { MessageModule } from './chats/message/message.module';
import { RoleModule } from './chats/role/role.module';
import { GameModule } from './pong/game/game.module';
import { UserChatModule } from './chats/user-chat/user-chat.module';
import { GameInvitesModule } from './pong/game_invite/game-invite.module';
import { MatchmakingRequestModule } from './pong/matchmaking-request/matchmaking-request.module';
import { UserModule } from './users/user/user.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { UserRelationshipModule } from './users/user-relationship/user-relationship.module';
import { AchievementsModule } from './users/achievements/achievements.module';
import { UserAchievementsModule } from './users/user-achievements/user-achievements.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
		AuthModule,
		SharedModule,
		ChatModule,
		MessageModule,
		UserModule,
		RoleModule,
		GameModule,
		UserChatModule,
		GameInvitesModule,
		MatchmakingRequestModule,
		UserRelationshipModule,
		AchievementsModule,
		UserAchievementsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
