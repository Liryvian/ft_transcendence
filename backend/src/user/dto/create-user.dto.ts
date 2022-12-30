import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	password: string;

	@IsBoolean()
	@IsNotEmpty()
	is_intra: boolean;
}
