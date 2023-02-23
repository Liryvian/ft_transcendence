import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractService } from '../../shared/abstract.service';
import { Achievement } from './entities/achievement.entity';

@Injectable()
export class AchievementsService extends AbstractService<Achievement> {
	constructor(
		@InjectRepository(Achievement)
		protected readonly repository: Repository<Achievement>,
	) {
		super(repository);
	}
}
