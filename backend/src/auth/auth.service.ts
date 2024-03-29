import {
	BadRequestException,
	Injectable,
	NotFoundException,
	SetMetadata,
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

export const AllowUnauthorizedRequest = () =>
	SetMetadata('allowUnauthorizedRequest', true);

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

	async getAuthenticatedApiUser(data: IntraTokendataDto) {
		return await fetch('https://api.intra.42.fr/v2/me', {
			headers: {
				Authorization: `Bearer ${data.access_token}`,
			},
		})
			.then((response) => response.json())
			.then((userData) => userData);
	}

	async exchangeCodeForToken(code: string) {
		const data = new URLSearchParams({
			grant_type: 'authorization_code',
			code: code,
			client_id: this.configService.get('API_UID'),
			client_secret: this.configService.get('API_SECRET'),
			redirect_uri: this.configService.get('API_REDIR_URI'),
		});

		return await fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			mode: 'cors',
			body: data,
		})
			.then((response) => response.json())
			.then(async (data) => data);
	}

	async processUserData(userData: any): Promise<ProcessedUserDto> {
		try {
			const user = await this.userService.findOne({
				where: { intra_id: userData.id },
			});

			const returnObject = {
				redirectLocation: '/intra/profiles',
				user: user,
			};
			if (user.two_factor_required) {
				returnObject.redirectLocation = '/2fa';
			}
			return returnObject;
		} catch (e) {
			if (e instanceof NotFoundException) {
				const newUser = new User();

				newUser.intra_id = userData.id;
				newUser.is_intra = true;
				newUser.name = userData.login;
				newUser.intra_login = userData.login;

				const nameSuffixOptions = [
					'',
					'_' + userData.id.toString(),
					'_' + crypto.pseudoRandomBytes(4).toString('hex'),
				];
				for (let index = 0; index < nameSuffixOptions.length; index++) {
					const element = nameSuffixOptions[index];
					try {
						newUser.name += element;
						const user = await this.userService.save(newUser);

						return Promise.resolve({
							redirectLocation: '/intra/settings',
							user: user,
						});
					} catch (e) {
						if (!(e instanceof QueryFailedError)) {
							throw new BadRequestException(
								'Something went wrong on trying to create the user',
							);
						}
					}
				}
				throw new BadRequestException('User could not be created');
			}
		}
	}

	login(user: User, response: Response, with_2fa: boolean = false) {
		const jwt = this.jwtService.sign({
			id: user.id,
			require_2fa: user.two_factor_required,
			validated_2fa: with_2fa,
		});
		response.cookie('jwt', jwt, { httpOnly: true });
	}

	async logout(response: Response) {
		response.clearCookie('jwt');
	}

	async userId(request: Request): Promise<number> {
		const cookie = request.cookies['jwt'];

		return this.userIdFromCookieString(cookie);
	}

	async validUserId(request: Request): Promise<number> {
		const userId = await this.userId(request);
		await this.userService.findOne({ where: { id: userId } });

		return userId;
	}

	userIdFromCookieString(cookie: string) {
		try {
			const data = this.jwtService.verify(cookie);

			return data['id'];
		} catch (e) {
			throw new BadRequestException('Invalid Authentication');
		}
	}
}
