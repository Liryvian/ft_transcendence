import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import AuthGuard from '../../auth/auth.guard';
import { UserAchievementsService } from './user-achievements.service';

@UseGuards(AuthGuard())
@Controller('user-achievements')
export class UserAchievementsController {
	constructor(
		private readonly userAchievementsService: UserAchievementsService,
	) {}

	@Get()
	async findAll() {
		return this.userAchievementsService.findAll({
			relations: { users: true, achievements: true },
		});
	}

	@Get(':id')
	async findOne(@Param('id') id: number) {
		return this.userAchievementsService.findOne({ where: { user_id: id } });
	}
}
