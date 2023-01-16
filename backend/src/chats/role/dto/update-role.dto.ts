import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsOptional } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
	// !! since there is only one 'variable' shall I use the decorator @IsNotEmpty() or is that weird?
	@IsOptional()
	name?: string;
}
