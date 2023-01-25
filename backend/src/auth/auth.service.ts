import {
	BadRequestException,
	Injectable,
	NotFoundException,
	ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { User } from '../users/user/entities/user.entity';
import { QueryFailedError } from 'typeorm';
import * as crypto from 'crypto';
import { IntraTokendataDto } from './dto/intra-tokendata.dto';
import { UserService } from '../users/user/user.service';
import { globalValidationPipeOptions } from '../main.validationpipe';
import { ConfigService } from '@nestjs/config';
import { ProcessedUserDto } from './dto/processedUser.dto';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService,
		private configService: ConfigService,
	) {}

	async validateIntraTokenData(data): Promise<IntraTokendataDto> {
		const validator = new ValidationPipe(globalValidationPipeOptions());
		try {
			const validTokenData = await validator.transform(data, {
				type: 'body',
				metatype: IntraTokendataDto,
			});
			return validTokenData;
		} catch (e) {
			throw new BadRequestException(
				'Bad data recieved from intra api in authentication flow',
			);
		}
	}

	async authenticatedThroughApi(data: IntraTokendataDto) {
		return await fetch('https://api.intra.42.fr/v2/me', {
			headers: {
				Authorization: `Bearer ${data.access_token}`,
			},
		})
			.then((response) => response.json())
			.then(
				(userData) => userData,
				// this.authService.processUserData(userData, data),
			);
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
			.then(async (data) => data);
	}

	async processUserData(
		userData: any,
		tokendata: IntraTokendataDto,
	): Promise<ProcessedUserDto> {
		try {
			const user = await this.userService.findOne({
				where: { intra_id: userData.id },
			});

			return Promise.resolve({
				redirectLocation: '/?type=recurring_user',
				userId: user.id,
			});
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
					const user = await this.userService.save(newUser);

					return Promise.resolve({
						redirectLocation: '/?type=new_user',
						userId: user.id,
					});
				} catch (e) {
					if (e instanceof QueryFailedError) {
						newUser.name += '_' + userData.id.toString();
						const findMatchOnId: User[] = await this.userService.findAll({
							where: { name: newUser.name },
						});
						if (findMatchOnId.length) {
							newUser.name += crypto.pseudoRandomBytes(10).toString('hex');
						}
						const user = await this.userService.save(newUser);
						return Promise.resolve({
							redirectLocation: '/?type=new_user',
							userId: user.id,
						});
					} else {
						throw new BadRequestException(
							'something went wrong on creating the user',
						);
					}
				}
			}
		}
	}

	async login(id: number, response: Response) {
		const jwt = await this.jwtService.signAsync({ id: id });
		response.cookie('jwt', jwt, { httpOnly: true });
	}

	async userId(request: Request): Promise<number> {
		const cookie = request.cookies['jwt'];
		const data = this.jwtService.verify(cookie);

		return data['id'];
	}
}
