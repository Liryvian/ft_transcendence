import { Module } from '@nestjs/common';
import { AchievementsModule } from '../../users/achievements/achievements.module';
import { UserAchievementsModule } from '../../users/user-achievements/user-achievements.module';
import { UserModule } from '../../users/user/user.module';
import { AuthModule } from '../auth.module';
import { TwoFaController } from './twofa.controller';
import { TwoFaService } from './twofa.service';

@Module({
	imports: [UserModule, AuthModule, AchievementsModule, UserAchievementsModule],
	controllers: [TwoFaController],
	providers: [TwoFaService],
	exports: [TwoFaService],
})
export class TwoFaModule {}
