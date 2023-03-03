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
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user/user.service';
import { AllowUnauthorizedRequest, AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { IntraTokendataDto } from './dto/intra-tokendata.dto';
import { Api42Guard } from './api42.guard';
import { AuthGuard } from './auth.guard';

//
@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
	constructor(
		private userService: UserService,
		private authService: AuthService,
		private configService: ConfigService,
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
		@Query('state') state: string,
		@Res() response: Response,
	): Promise<any> {
		const rawTokenData = await this.authService.exchangeCodeForToken(code);

		if (rawTokenData.hasOwnProperty('error')) {
			throw new BadRequestException(rawTokenData.error_description);
		}

		const validatedTokenData: IntraTokendataDto =
			await this.authService.validateIntraTokenData(rawTokenData);

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
	async logout(@Res({ passthrough: true }) response: Response) {
		this.authService.logout(response);
		return {
			message: 'Success',
		};
	}

	@UseGuards(AuthGuard())
	@Get('logout')
	@HttpCode(HttpStatus.OK)
	async logoutGet(@Res({ passthrough: true }) response: Response) {
		this.authService.logout(response);
		return {
			message: 'Success',
		};
	}
}
