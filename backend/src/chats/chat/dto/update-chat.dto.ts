import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-chat.dto';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { ChatVisibility } from '../entities/chat.entity';

export class UpdateChatDto extends PartialType(CreateChatDto) {
	@IsOptional()
	name?: string;

	@IsOptional()
	visibility?: ChatVisibility;

	@ValidateIf((o) => o.hasOwnProperty('password'))
	@IsOptional()
	@IsNotEmpty()
	new_password?: string;

	@IsOptional()
	@IsNotEmpty()
	password?: string;
}
