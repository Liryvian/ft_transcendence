import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from '../../shared/abstract.service';
import { Repository } from 'typeorm';
import { MatchmakingRequest } from './entities/matchmaking-request.entity';

@Injectable()
export class MatchmakingRequestService extends AbstractService<MatchmakingRequest> {
	constructor(
		@InjectRepository(MatchmakingRequest)
		protected readonly repository: Repository<MatchmakingRequest>,
	) {
		super(repository);
	}
}
