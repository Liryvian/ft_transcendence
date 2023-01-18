import { Match } from '../../../shared/match.decorator';
import { IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	password: string;

	@Match(RegisterUserDto, (o) => o.password)
	@IsNotEmpty()
	password_confirm: string;
}
