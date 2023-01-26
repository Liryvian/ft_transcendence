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

		return bcrypt.compare(
			this.configService.get('API_REDIR_URI'),
			request.query['state'],
		);
	}
}
