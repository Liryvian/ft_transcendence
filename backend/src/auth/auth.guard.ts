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
				// jwt should probably have a time element to reject after long absence

				const jwt = request.cookies['jwt'];
				const validated = this.jwtService.verify(jwt);

				const user = await this.dataSource.getRepository(User).findOneBy({
					id: validated.id,
				});
				if (user.has_2fa_on) {
					// should have a `has_2fa_on` property set to true
					// should have a `validated_2fa` property set to true
					if (
						!validated.hasOwnProperty('has_2fa_on') ||
						validated.has_2fa_on === false ||
						!validated.hasOwnProperty('validated_2fa') ||
						validated.validated_2fa === false
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
