import { forwardRef, Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { AuthModule } from '../../auth/auth.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Achievement]),
		forwardRef(() => AuthModule),
	],
	controllers: [AchievementsController],
	providers: [AchievementsService],
	exports: [AchievementsService],
})
export class AchievementsModule {}
