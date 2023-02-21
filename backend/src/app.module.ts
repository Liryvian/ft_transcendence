import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm/typeorm.service';
import { ChatModule } from './chats/chat/chat.module';
import { MessageModule } from './chats/message/message.module';
import { GameModule } from './pong/game/game.module';
import { GameInvitesModule } from './pong/game_invite/game-invite.module';
import { MatchmakingRequestModule } from './pong/matchmaking-request/matchmaking-request.module';
import { UserModule } from './users/user/user.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { SeedersModule } from './seeders/seeders.module';
import { UserRelationshipModule } from './users/user-relationship/user-relationship.module';
import { AchievementsModule } from './users/achievements/achievements.module';
import { UserAchievementsModule } from './users/user-achievements/user-achievements.module';
import { ChatUserPermissionModule } from './chats/chat-user-permissions/chat-user-permission.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MeModule } from './me/me.module';
import { AppService } from './app.service';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: '/src/app/public',
			serveStaticOptions: {
				index: false,
			},
		}),
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
		AuthModule,
		SharedModule,
		ChatModule,
		MessageModule,
		UserModule,
		GameModule,
		ChatUserPermissionModule,
		GameInvitesModule,
		MatchmakingRequestModule,
		SeedersModule,
		UserRelationshipModule,
		AchievementsModule,
		UserAchievementsModule,
		MeModule,
	],
	providers: [AppService],
	controllers: [AppController],
})
export class AppModule {}
