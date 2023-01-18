import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import {IsNotEmpty, IsOptional} from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
	@IsNotEmpty()
	@IsOptional()
	name?: string;
}
