import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimalModule } from './test_example/animal.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm/typeorm.service';
import { GameModule } from './pong/game/game.module';
import { GameInvitesModule } from './pong/game_invite/game-invite.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { MatchmakingRequestModule } from './pong/matchmaking-request/matchmaking-request.module';
import { EventsModule } from './events/events.module';
import { PongModule } from './pong/pong.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
		AnimalModule,
		GameModule,
		GameInvitesModule,
		UserModule,
		AuthModule,
		SharedModule,
		AnimalModule,
		GameModule,
		MatchmakingRequestModule,
		EventsModule,
		PongModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
