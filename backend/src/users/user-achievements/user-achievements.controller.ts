import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	BadRequestException,
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
	async create(@Body() createUserAchievementDto: CreateUserAchievementDto) {
		try {
			const newUserAchievement = await this.userAchievementsService.create(
				createUserAchievementDto,
			);
			return newUserAchievement;
		} catch (e) {
			throw new BadRequestException(
				'User can have only one of each achievements',
			);
		}
	}

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

	@Patch(':id')
	async update(
		@Param('id') id: number,
		@Body() updateUserAchievementDto: UpdateUserAchievementDto,
	) {
		return this.userAchievementsService.update(id, updateUserAchievementDto);
	}

	@Delete(':id')
	async remove(@Param('id') id: number) {
		return this.userAchievementsService.remove(id);
	}
}
