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
import { Response, Request } from 'express';
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
		res.redirect(
			`https://api.intra.42.fr/oauth/authorize?client_id=${this.configService.get(
				'API_UID',
			)}&redirect_uri=${this.configService.get(
				'API_REDIR_URI',
			)}&response_type=code`,
		);
	}

	@Get('/auth/oauth42')
	async recieveCodeFromApi(@Query('code') code: string) {
		console.log('code from /auth/authenticate:[', code, ']');
		// if (!code || code === '') {
		// 	throw new BadRequestException('Invalid Code');
		// }

		const state = crypto.randomBytes(8).toString('hex');

		const data = new URLSearchParams({
			grant_type: 'authorization_code',
			code: code,
			client_id: this.configService.get('API_UID'),
			client_secret: this.configService.get('API_SECRET'),
			redirect_uri: this.configService.get('API_REDIR_URI'),
			// state: state,
		});
		console.log(data);
		const tokenResponse = await fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			mode: 'cors',
			body: data,
		}).catch((err) => {
			console.log('err', err);
		});
		console.log({ tokenResponse });
		return { data, tokenResponse };
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

	@Post('/auth/oauth42')
	async recieveToken(@Body() body) {
		console.log('', { body });
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
