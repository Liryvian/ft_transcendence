import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TwoFaGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		// return true;

		const request = context.switchToHttp().getRequest();
		try {
			const jwt = request.cookies['jwt'];
			const validated = this.jwtService.verify(jwt);

			if (validated.hasOwnProperty('require_2fa') === false) {
				return false;
			}

			return validated;
		} catch (e) {
			return false;
		}
	}
}
