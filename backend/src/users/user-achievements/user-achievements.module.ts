import { forwardRef, Module } from '@nestjs/common';
import { UserAchievementsService } from './user-achievements.service';
import { UserAchievementsController } from './user-achievements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievement } from './entities/user-achievement.entity';
import { AuthModule } from '../../auth/auth.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserAchievement]),
		forwardRef(() => AuthModule),
		SharedModule,
	],
	controllers: [UserAchievementsController],
	providers: [UserAchievementsService],
	exports: [UserAchievementsService],
})
export class UserAchievementsModule {}
