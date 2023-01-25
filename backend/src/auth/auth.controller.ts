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
	Req,
	HttpCode,
	HttpStatus,
	Query,
	ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/user/user.service';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as crypto from 'crypto';
import { IntraTokendataDto } from './dto/intra-tokendata.dto';
import { globalValidationPipeOptions } from '../main.validationpipe';
import { validate } from 'class-validator';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
	constructor(
		private userService: UserService,
		private authService: AuthService,
		private configService: ConfigService,
	) {}

	@Get('/auth/authenticate')
	redirectToIntraApi(@Res() res: Response) {
		const client_id = this.configService.get('API_UID');
		const redirect_uri = this.configService.get('API_REDIR_URI');
		const state = crypto.pseudoRandomBytes(8).toString('hex');
		res.cookie('state', state);

		res.redirect(
			`https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&state=${state}`,
		);
	}

	@Get('/auth/oauth42')
	async recieveCodeFromApi(
		@Query('code') code: string,
		@Query('state') state: string,
		@Res() res: Response,
		@Req() req: Request,
	) {
		const cookieState = req.cookies['state'] ?? false;
		res.clearCookie('state');
		if (cookieState === false || cookieState !== state) {
			console.error('api auth flow --- state does not match');
			return res.redirect('/');
		}

		const rawTokenData = await this.authService.exchangeCodeForToken(
			code,
			state,
		);
		const validatedTokenData: IntraTokendataDto =
			await this.authService.validateIntraTokenData(rawTokenData);
		const userData = await this.authService.authenticatedThroughApi(
			validatedTokenData,
		);
		const { redirectLocation, userId } = await this.authService.processUserData(
			userData,
			validatedTokenData,
		);
		this.authService.login(userId, res);
		return res.redirect(redirectLocation);
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
			await this.authService.login(user.id, response);
			return user;
		} catch (e) {
			throw new BadRequestException('Invalid user/password combination');
		}
	}

	@UseGuards(AuthGuard)
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(@Res({ passthrough: true }) response: Response) {
		response.clearCookie('jwt');
		return {
			message: 'Success',
		};
	}

	@UseGuards(AuthGuard)
	@Get('me')
	async getAuthenticatedUser(@Req() request: Request) {
		const id = await this.authService.userId(request);
		return this.userService.findOne({
			where: {
				id: id,
			},
		});
	}
}
