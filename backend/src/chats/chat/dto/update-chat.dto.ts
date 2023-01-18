import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-chat.dto';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class UpdateChatDto extends PartialType(CreateChatDto) {
	@IsOptional()
	name?: string;

	@IsOptional()
	visibility?: string;

	@IsOptional()
	new_password?: string;

	@ValidateIf((o) => o.hasOwnProperty('new_password'))
	@IsNotEmpty()
	password?: string;
}
