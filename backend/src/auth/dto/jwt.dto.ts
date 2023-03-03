import { IsNotEmpty } from 'class-validator';

export class JwtDto {
	@IsNotEmpty()
	id: number;

	@IsNotEmpty()
	require_2fa: boolean;

	@IsNotEmpty()
	validated_2fa: boolean;

	@IsNotEmpty()
	exp: number;
}
