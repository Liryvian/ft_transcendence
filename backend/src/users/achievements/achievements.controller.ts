import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

@Controller('achievements')
export class AchievementsController {
	constructor(private readonly achievementsService: AchievementsService) {}

	@Post()
	create(@Body() createAchievementDto: CreateAchievementDto) {
		return this.achievementsService.insert(createAchievementDto);
	}

	@Get()
	findAll() {
		return this.achievementsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.achievementsService.findOne({ where: { id } });
	}

	@Patch(':id')
	update(
		@Param('id') id: number,
		@Body() updateAchievementDto: UpdateAchievementDto,
	) {
		return this.achievementsService.update(id, updateAchievementDto);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.achievementsService.remove(id);
	}
}