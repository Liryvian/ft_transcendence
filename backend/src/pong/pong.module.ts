import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../users/user/user.module';
import { GameModule } from './game/game.module';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';

@Module({
	imports: [GameModule, UserModule],
	providers: [PongGateway, PongService, AuthService],
	exports: [PongGateway, PongService],
})
export class PongModule {}
