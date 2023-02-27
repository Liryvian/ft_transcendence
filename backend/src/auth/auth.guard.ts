import {
	CanActivate,
	ExecutionContext,
	Inject,
	Type,
	mixin,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user/entities/user.entity';

const AuthGuard = (): Type<CanActivate> => {
	class AuthGuardMixin {
		constructor(
			private jwtService: JwtService,
			@Inject(DataSource) private readonly dataSource: DataSource,
		) {}

		async canActivate(context: ExecutionContext): Promise<boolean> {
			const request = context.switchToHttp().getRequest<Request>();
			try {
				const jwt = request.cookies['jwt'];
				const validated = this.jwtService.verify(jwt);

				const user = await this.dataSource.getRepository(User).findOneBy({
					id: validated.id,
				});
				if (user.has_2fa) {
					if (
						!validated.hasOwnProperty('has2fa') ||
						validated.has2fa === false
					) {
						return false;
					}
				}
				return validated;
			} catch (e) {
				return false;
			}
		}
	}
	return mixin(AuthGuardMixin);
};
export default AuthGuard;
