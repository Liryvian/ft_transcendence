import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user/user.module';
import { TwoFaModule } from './twofa/twofa.module';
import { AchievementsModule } from '../users/achievements/achievements.module';
import { UserAchievementsModule } from '../users/user-achievements/user-achievements.module';

@Module({
	imports: [
		forwardRef(() => UserModule),
		TwoFaModule,
		AchievementsModule,
		UserAchievementsModule,
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
