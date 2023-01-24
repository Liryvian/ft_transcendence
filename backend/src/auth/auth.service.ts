import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { User } from '../users/user/entities/user.entity';
import { QueryFailedError } from 'typeorm';
import * as crypto from 'crypto';
import { IntraTokendata } from './dto/intra-tokendata.dto';
import { UserService } from '../users/user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService,
	) {}

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
