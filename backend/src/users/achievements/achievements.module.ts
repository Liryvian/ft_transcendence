import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Achievement])],
	controllers: [AchievementsController],
	providers: [AchievementsService],
	exports: [AchievementsService],
})
export class AchievementsModule {}
