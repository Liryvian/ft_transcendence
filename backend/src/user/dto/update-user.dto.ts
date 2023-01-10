import { Match } from '../../shared/match.decorator';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsNotEmpty()
	name?: string;

	@IsOptional()
	@IsNotEmpty()
	new_password?: string;

	@ValidateIf((o) => o.hasOwnProperty('new_password'))
	@Match(UpdateUserDto, (o) => o.new_password)
	new_password_confirm?: string;

	@ValidateIf((o) => o.hasOwnProperty('new_password'))
	@IsNotEmpty()
	password?: string;
}
