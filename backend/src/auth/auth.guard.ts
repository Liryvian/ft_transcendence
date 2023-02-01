import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		// return true;
		const request = context.switchToHttp().getRequest();
		try {
			const jwt = request.cookies['jwt'];
			const validated = this.jwtService.verify(jwt);
			return validated;
		} catch (e) {
			return false;
		}
	}
}
