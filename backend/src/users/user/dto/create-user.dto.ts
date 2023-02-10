import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	password: string;

	@IsOptional()
	@IsBoolean()
	is_intra?: boolean = false;
}
