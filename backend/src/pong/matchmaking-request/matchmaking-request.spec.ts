import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { MatchmakingRequest } from './entities/matchmaking-request.entity';
import { MatchmakingRequestController } from './matchmaking-request.controller';
import { MatchmakingRequestService } from './matchmaking-request.service';

describe('MatchmakingRequestService', () => {
	let service: MatchmakingRequestService;
	let controller: MatchmakingRequestController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([MatchmakingRequest]),
			],
			providers: [MatchmakingRequestService],
			controllers: [MatchmakingRequestController],
		}).compile();

		service = module.get<MatchmakingRequestService>(MatchmakingRequestService);
		controller = module.get<MatchmakingRequestController>(
			MatchmakingRequestController,
		);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});
});
