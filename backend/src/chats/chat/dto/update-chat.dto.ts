import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-chat.dto';
import {IsNotEmpty, IsOptional, ValidateIf} from 'class-validator';

export class UpdateChatDto extends PartialType(CreateChatDto) {
	@IsOptional()
	name?: string;

	@IsOptional()
	visibility?: string;

	@ValidateIf((o) => o.hasOwnProperty('password')) // only continues validation if the object also contains a `password` field
	@IsNotEmpty()
	old_password?: string;

	@IsOptional()
	password?: string;
}
