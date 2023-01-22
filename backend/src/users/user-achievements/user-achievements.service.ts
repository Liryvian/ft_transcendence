import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractService } from '../../shared/abstract.service';
import { UserAchievement } from './entities/user-achievement.entity';

@Injectable()
export class UserAchievementsService extends AbstractService<UserAchievement> {
	constructor(
		@InjectRepository(UserAchievement)
		protected readonly repository: Repository<UserAchievement>,
	) {
		super(repository);
	}
}
