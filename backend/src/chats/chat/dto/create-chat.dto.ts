import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class CreateChatDto {
	@IsNotEmpty()
	name: string;

	@IsOptional()
	visibility?: string;

	@IsOptional()
	password?: string;

	@IsOptional()
	type?: string;
}
