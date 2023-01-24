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
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '../users/user/entities/user.entity';
import * as crypto from 'crypto';
import { IntraTokendata } from './dto/intra-tokendata.dto';
import { globalValidationPipeOptions } from '../main.validationpipe';
import { QueryFailedError } from 'typeorm';

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
	redirectToIntraApi(@Res() res: Response) {
		const client_id = this.configService.get('API_UID');
		const redirect_uri = this.configService.get('API_REDIR_URI');

		const state = crypto.pseudoRandomBytes(8).toString('hex');
		// store state in cookie, and get it from the other endpoint to match incoming state?

		res.redirect(
			`https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&state=${state}`,
		);
	}

	async processUserData(
		userData: any,
		tokendata: IntraTokendata,
	): Promise<string> {
		try {
			await this.userService.findOne({
				where: { intra_id: userData.id },
			});

			return Promise.resolve('/?type=recurring_user');
		} catch (e) {
			if (e instanceof NotFoundException) {
				const newUser = new User();

				newUser.intra_id = userData.id;
				newUser.is_intra = true;
				newUser.name = userData.login;
				newUser.intra_login = userData.login;
				newUser.intra_token = tokendata.access_token;
				newUser.intra_refresh = tokendata.refresh_token;
				newUser.intra_expires = new Date(
					(tokendata.created_at + tokendata.expires_in) *
						(tokendata.created_at < 3000000000 ? 1000 : 1),
				);

				// const userWithSameName: User[] = await this.userService.findAll({
				// 	where: { name: userData.login },
				// });
				// if (userWithSameName.length) {
				// 	newUser.name += '_' + userData.id.toString();
				// }

				/*
				// for after refactor
				*!/
				const newUserx = this.userService.create({
					intra_id: userData.id,
					is_intra: true,
					name: userData.login,
					intra_login: userData.login,
					intra_token: tokendata.access_token,
					intra_refresh: tokendata.refresh_token,
					intra_expires:
						(tokendata.created_at + tokendata.expires_in) *
						(tokendata.created_at < 3000000000 ? 1000 : 1),
				});
				/**/
				try {
					await this.userService.save(newUser);
				} catch (e) {
					if (e instanceof QueryFailedError) {
						newUser.name += '_' + userData.id.toString();
						const findMatchOnId: User[] = await this.userService.findAll({
							where: { name: newUser.name },
						});
						if (findMatchOnId.length) {
							newUser.name += crypto.pseudoRandomBytes(10).toString('hex');
						}
						await this.userService.save(newUser);
					} else {
						throw new BadRequestException(
							'something went wrong on creating the user',
						);
					}
				}
				return Promise.resolve('/?new_user');
			}
		}
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
				.then(async (userData) => this.processUserData(userData, stripped));
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
