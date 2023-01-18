import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-chat.dto';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class UpdateChatDto extends PartialType(CreateChatDto) {
	@IsOptional()
	name?: string;

	@IsOptional()
	visibility?: string;

	@ValidateIf((o) => o.hasOwnProperty('password'))
	@IsOptional()
	@IsNotEmpty()
	new_password?: string;

	@IsOptional()
	@IsNotEmpty()
	password?: string;
}
