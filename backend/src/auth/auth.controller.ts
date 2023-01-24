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
import { IntraTokendata } from './dto/intra-tokendata.dto';
import { globalValidationPipeOptions } from '../main.validationpipe';

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
		// store state in cookie, and get it from the other endpoint to match incoming state?

		res.redirect(
			`https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&state=${state}`,
		);
	}

	async authenticatedThroughApi(data: IntraTokendata) {
		const validator = new ValidationPipe(globalValidationPipeOptions());
		try {
			const stripped = await validator.transform(data, {
				type: 'body',
				metatype: IntraTokendata,
			});
			return await fetch('https://api.intra.42.fr/v2/me', {
				headers: {
					Authorization: `Bearer ${stripped.access_token}`,
				},
			})
				.then((response) => response.json())
				.then(async (userData) =>
					this.authService.processUserData(userData, stripped),
				);
		} catch (e) {
			throw new BadRequestException(
				'Bad data recieved from intra api in authentication flow',
			);
		}
	}

	async exchangeCodeForToken(code: string, state: string) {
		const data = new URLSearchParams({
			grant_type: 'authorization_code',
			code: code,
			client_id: this.configService.get('API_UID'),
			client_secret: this.configService.get('API_SECRET'),
			redirect_uri: this.configService.get('API_REDIR_URI'),
			state: state,
		});

		return await fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			mode: 'cors',
			body: data,
		})
			.then((response) => response.json())
			.then(async (data) => {
				return this.authenticatedThroughApi(data);
			});
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
		return res.redirect(await this.exchangeCodeForToken(code, state));
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
