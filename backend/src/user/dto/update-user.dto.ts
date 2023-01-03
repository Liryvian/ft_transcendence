import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
	@IsNotEmpty()
	name: string;
}
