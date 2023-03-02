import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AchievementsService } from '../../users/achievements/achievements.service';
import { Achievement } from '../../users/achievements/entities/achievement.entity';
import { UserAchievement } from '../../users/user-achievements/entities/user-achievement.entity';
import { UserAchievementsService } from '../../users/user-achievements/user-achievements.service';
import { UserService } from '../../users/user/user.service';
import { AuthGuard } from '../auth.guard';
import { AuthService } from '../auth.service';
import { TwoFaDto } from './dto/twofa.dto';
import { TwoFaService } from './twofa.service';

@Controller('auth/2fa')
export class TwoFaController {
	constructor(
		private readonly twoFaService: TwoFaService,
		private readonly userService: UserService,
		private readonly authService: AuthService,
		private readonly achievementService: AchievementsService,
		private readonly userAchievementsService: UserAchievementsService,
	) {}

	@UseGuards(AuthGuard)
	@Get('qr')
	twofa_get_qr() {
		return this.twoFaService.generateSecret();
	}

	@Post('activate')
	async twofa_activate(
		@Body() twoFaDto: TwoFaDto,
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		const isValid = this.twoFaService.verify2faCode(twoFaDto);

		if (isValid === false) {
			return isValid;
		}

		const userId = await this.authService.userId(request);
		const user = await this.userService.findOne({ where: { id: userId } });

		// try assigning achievement to user
		try {
			const twoFaAchievement: Achievement =
				await this.achievementService.findOne({
					where: { name: 'You turned on 2fa! Nice job security geek!' },
				});
			const currentAchievement: UserAchievement[] =
				await this.userAchievementsService.findAll({
					where: {
						user_id: user.id,
						achievement_id: twoFaAchievement.id,
					},
				});
			if (currentAchievement.length === 0) {
				// user does not yet have this achievement, add it
				await this.userAchievementsService.save({
					user_id: user.id,
					achievement_id: twoFaAchievement.id,
				});
			}
		} catch (e) {
			// ignore if something goes wrong
		}

		user.two_factor_required = true;
		user.two_factor_secret = twoFaDto.secret;
		await this.userService.save(user);

		// replace jwt cookie with updated info
		this.authService.login(user, response, true);
		return isValid;
	}

	// should get a guard in next step @UseGuards(TwoFaGuard)
	@Post('deactivate')
	async twofa_deactivate(
		@Body() twoFaDto: TwoFaDto,
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		const userId = await this.authService.userId(request);
		const user = await this.userService.findOne({ where: { id: userId } });

		const isValid = this.twoFaService.verify2faCode({
			...twoFaDto,
			secret: user.two_factor_secret,
		});

		if (isValid === false) {
			return false;
		}

		user.two_factor_required = false;
		user.two_factor_secret = null;
		await this.userService.save(user);

		this.authService.login(user, response, false);
		return isValid;
	}
}
