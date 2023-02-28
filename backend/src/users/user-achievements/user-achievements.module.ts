import { Module } from '@nestjs/common';
import { UserAchievementsService } from './user-achievements.service';
import { UserAchievementsController } from './user-achievements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievement } from './entities/user-achievement.entity';

@Module({
	imports: [TypeOrmModule.forFeature([UserAchievement])],
	controllers: [UserAchievementsController],
	providers: [UserAchievementsService],
	exports: [UserAchievementsService],
})
export class UserAchievementsModule {}
