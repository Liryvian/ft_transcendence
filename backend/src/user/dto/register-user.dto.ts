import { IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	password_confirm: string;
}
