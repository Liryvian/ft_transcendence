import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Api42Guard implements CanActivate {
	constructor(private configService: ConfigService) {}
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();

		console.log('query: ', request.query['state']);
		// if (
		// 	!request.hasOwnProperty('cookies') ||
		// 	!request.cookies.hasOwnProperty('state')
		// ) {
		// 	return false;
		// }
		// const state = request.cookies['state'];
		// const state = request.Query['state'];
		const state = request.query['state'];
		const state2 = bcrypt.hashSync(this.configService.get('API_REDIR_URI'), 9);
		const result = bcrypt.compare(
			state,
			this.configService.get('API_REDIR_URI'),
		);
		console.log(result, state, state2);
		return result;
	}
}
