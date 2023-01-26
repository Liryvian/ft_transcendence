import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class Api42Guard implements CanActivate {
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();

		if (
			request.hasOwnProperty('cookies') &&
			request.cookies.hasOwnProperty('state')
		) {
			return true;
		}
		return false;
	}
}
