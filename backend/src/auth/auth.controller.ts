import {
	BadRequestException,
	Body,
	Controller,
	Post,
	Res,
	UseGuards,
	UseInterceptors,
	ClassSerializerInterceptor,
	Get,
	HttpCode,
	HttpStatus,
	Query,
	Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user/user.service';
import { AllowUnauthorizedRequest, AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { IntraTokendataDto } from './dto/intra-tokendata.dto';
import { Api42Guard } from './api42.guard';
import AuthGuard from './auth.guard';
import { TwoFaService } from './twofa/twofa.service';
import { TwoFaDto } from './dto/twofa.dto';
import { TwoFaGuard } from './twofa/twofa.guard';
import { Achievement } from '../users/achievements/entities/achievement.entity';
import { AchievementsService } from '../users/achievements/achievements.service';
import { UserAchievementsService } from '../users/user-achievements/user-achievements.service';
import { UserAchievement } from '../users/user-achievements/entities/user-achievement.entity';
import { Like } from 'typeorm';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
	constructor(
		private userService: UserService,
		private authService: AuthService,
		private configService: ConfigService,
		private twoFaService: TwoFaService,
		private achievementService: AchievementsService,
		private userAchievementsService: UserAchievementsService,
	) {}

	@Get('/auth/authenticate')
	@AllowUnauthorizedRequest()
	redirectToIntraApi(@Res() response: Response) {
		const client_id = this.configService.get('API_UID');
		const redirect_uri = this.configService.get('API_REDIR_URI');
		const state = bcrypt.hashSync(this.configService.get('API_STATE'), 9);

		response.redirect(
			`https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&state=${state}`,
		);
	}

	@UseGuards(Api42Guard)
	@Get('/auth/oauth42')
	async recieveCodeFromApi(
		@Query('code') code: string,
		@Res() response: Response,
	): Promise<any> {
		const rawTokenData = await this.authService.exchangeCodeForToken(code);

		if (rawTokenData.hasOwnProperty('error')) {
			throw new BadRequestException(rawTokenData.error_description);
		}

		const validatedTokenData: IntraTokendataDto =
			await this.authService.validateIntraTokenData(rawTokenData);

		// user data from API
		const userData = await this.authService.getAuthenticatedApiUser(
			validatedTokenData,
		);

		if (userData.hasOwnProperty('error')) {
			throw new BadRequestException(userData.message);
		}

		const { redirectLocation, user } = await this.authService.processUserData(
			userData,
		);

		this.authService.login(user, response);
		return response.redirect(redirectLocation);
	}

	@Post('login')
	async login(
		@Body() loginUserDto: LoginUserDto,
		@Res({ passthrough: true }) response: Response,
	) {
		try {
			const user = await this.userService.findOne({
				where: {
					name: loginUserDto.name,
				},
			});
			if (
				!user ||
				!(await bcrypt.compare(loginUserDto.password, user.password))
			) {
				throw new BadRequestException('Invalid user/password combination');
			}
			this.authService.login(user, response);
			return user;
		} catch (e) {
			throw new BadRequestException('Invalid user/password combination');
		}
	}

	@UseGuards(AuthGuard())
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	logout(@Res({ passthrough: true }) response: Response) {
		this.authService.logout(response);

		return {
			message: 'Success',
		};
	}

	@UseGuards(AuthGuard())
	@Get('logout')
	@HttpCode(HttpStatus.OK)
	logoutGet(@Res({ passthrough: true }) response: Response) {
		this.authService.logout(response);

		return {
			message: 'Success',
		};
	}

	@UseGuards(AuthGuard())
	@Get('auth/2fa_qr')
	twofa_get_qr() {
		return this.twoFaService.generateSecret();
	}

	@UseGuards(TwoFaGuard)
	@Post('auth/activate_2fa')
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

	@UseGuards(TwoFaGuard)
	@Post('auth/deactivate_2fa')
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
