import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';

@Module({
	imports: [GameModule],
	providers: [PongGateway, PongService],
	exports: [PongGateway, PongService],
})
export class PongModule {}
