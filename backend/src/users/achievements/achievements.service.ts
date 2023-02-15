import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractService } from '../../shared/abstract.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
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
