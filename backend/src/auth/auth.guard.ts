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
import { JwtDto } from './dto/jwt.dto';

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
				const validated: JwtDto = this.jwtService.verify(jwt);

				const expiryTimestamp: number = validated.exp * 1000;
				const nowTimestamp = +new Date();
				if (nowTimestamp > expiryTimestamp) {
					return false;
				}

				const user = await this.dataSource.getRepository(User).findOneBy({
					id: validated.id,
				});
				if (user.two_factor_required) {
					if (
						!validated.hasOwnProperty('require_2fa') ||
						validated.require_2fa === false ||
						!validated.hasOwnProperty('validated_2fa') ||
						validated.validated_2fa === false
					) {
						return false;
					}
				}
				return true;
			} catch (e) {
				return false;
			}
		}
	}
	return mixin(AuthGuardMixin);
};
export default AuthGuard;
