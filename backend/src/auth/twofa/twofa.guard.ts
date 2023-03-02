import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtDto } from '../dto/jwt.dto';

@Injectable()
export class TwoFaGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		try {
			const jwt = request.cookies['jwt'];
			const validated: JwtDto = this.jwtService.verify(jwt);

			const expiryTimestamp: number = validated.exp * 1000;
			const nowTimestamp = +new Date();
			if (nowTimestamp > expiryTimestamp) {
				return false;
			}

			if (validated.hasOwnProperty('require_2fa') === false) {
				return false;
			}

			return true;
		} catch (e) {
			return false;
		}
	}
}
