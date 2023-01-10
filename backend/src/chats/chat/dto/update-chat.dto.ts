import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-chat.dto';
import { IsOptional } from 'class-validator';

export class UpdateChatDto extends PartialType(CreateChatDto) {
	@IsOptional()
	name?: string;

	@IsOptional()
	visibility?: string;

	@IsOptional()
	password?: string;
}
