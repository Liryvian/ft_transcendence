import { Module } from '@nestjs/common';
import { MatchmakingRequestService } from './matchmaking-request.service';
import { MatchmakingRequestController } from './matchmaking-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchmakingRequest } from './entities/matchmaking-request.entity';

@Module({
	imports: [TypeOrmModule.forFeature([MatchmakingRequest])],
	controllers: [MatchmakingRequestController],
	providers: [MatchmakingRequestService],
	exports: [MatchmakingRequestService],
})
export class MatchmakingRequestModule {}
