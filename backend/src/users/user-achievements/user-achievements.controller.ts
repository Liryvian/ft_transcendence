import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { UserAchievementsService } from './user-achievements.service';
import { CreateUserAchievementDto } from './dto/create-user-achievement.dto';
import { UpdateUserAchievementDto } from './dto/update-user-achievement.dto';

@Controller('user-achievements')
export class UserAchievementsController {
	constructor(
		private readonly userAchievementsService: UserAchievementsService,
	) {}

	@Post()
	create(@Body() createUserAchievementDto: CreateUserAchievementDto) {
		return this.userAchievementsService.create(createUserAchievementDto);
	}

	@Get()
	findAll() {
		return this.userAchievementsService.findAll({
			relations: { users: true, achievements: true },
		});
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.userAchievementsService.findOne({ where: { user_id: id } });
	}

	@Patch(':id')
	update(
		@Param('id') id: number,
		@Body() updateUserAchievementDto: UpdateUserAchievementDto,
	) {
		return this.userAchievementsService.update(id, updateUserAchievementDto);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.userAchievementsService.remove(id);
	}
}
