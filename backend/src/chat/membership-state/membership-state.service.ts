import { Injectable } from '@nestjs/common';
import { MembershipState } from './entities/membership-state.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../../shared/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MembershipStateService extends AbstractService<MembershipState> {
	constructor(
		@InjectRepository(MembershipState)
		private readonly membershipRepository: Repository<MembershipState>,
	) {
		super(membershipRepository);
	}
}
