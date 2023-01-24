import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}

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
