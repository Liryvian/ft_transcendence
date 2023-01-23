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
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request, response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as crypto from 'crypto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private authService: AuthService,
		private configService: ConfigService,
	) {}

	@Get('/auth/authenticate')
	redirectToIntraApi(@Res() res) {
		const client_id = this.configService.get('API_UID');
		const redirect_uri = this.configService.get('API_REDIR_URI');

		// const state = crypto.randomBytes(8).toString('hex');
		// store state in cookie, and get it from the other endpoint to match incoming state?

		const state = 'randomstring';

		res.redirect(
			`https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&state=${state}`,
		);
	}

	@Get('/auth/oauth42')
	async recieveCodeFromApi(
		@Query('code') code: string,
		@Query('state') state: string,
		@Res() res: Response,
	) {
		const data = new URLSearchParams({
			grant_type: 'authorization_code',
			code: code,
			client_id: this.configService.get('API_UID'),
			client_secret: this.configService.get('API_SECRET'),
			redirect_uri: this.configService.get('API_REDIR_URI'),
			state: state,
		});

		await fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			mode: 'cors',
			body: data,
		})
			.then((response) => response.json())
			.then((data) => {
				// here we have an access token
				// so we can query the API to get the user
				// check our database if intra_id exists
				// 		if exists == recurring user, redirect to dashboard
				//      if not exists == new user, redirect to account setup page
				console.log(data);

				const intra_id = 0;
				this.userService.findOne({ where: { intra_id } });
				console.log('redirect based on api');
			});
		console.log('redirect to homepage');
		return res.redirect('/');
		// exchange code for access token
		// console.log('Formdata going to send', formData);
		// try {

		// console.log('yoooooo', JSON.stringify(tokenResponse, null, 2));

		// 	return tokenResponse;
		// } catch (e) {
		// 	console.log('caught ', e);
		// }
		// res.redirect('/');
		// console.log(res);
	}

	/*

curl -v -F grant_type=authorization_code \
-F client_id=u-s4t2ud-b031c6d5380460c4a5145f1fe460f719d3819db34c4e47ac035fd7047ce3a387 \
-F client_secret=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 \
-F code=c5343a431e0fa22ba8122f82661aaf1e13cc84bf46a5cae63343388b723009c2 \
-F redirect_uri=http://localhost:8080/api/auth/oauth42 \
-X POST https://api.intra.42.fr/oauth/token

	*/
	// @Get('/auth/callback')
	// async recieveTokenFromApi()

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
			const jwt = await this.jwtService.signAsync({ id: user.id });
			response.cookie('jwt', jwt, { httpOnly: true });
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
