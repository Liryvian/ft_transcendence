import { forwardRef, Module } from '@nestjs/common';
import { MatchmakingRequestService } from './matchmaking-request.service';
import { MatchmakingRequestController } from './matchmaking-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchmakingRequest } from './entities/matchmaking-request.entity';
import { AuthModule } from '../../auth/auth.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([MatchmakingRequest]),
		forwardRef(() => AuthModule),
		SharedModule,
	],
	controllers: [MatchmakingRequestController],
	providers: [MatchmakingRequestService],
	exports: [MatchmakingRequestService],
})
export class MatchmakingRequestModule {}
