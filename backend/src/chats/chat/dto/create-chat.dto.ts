import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateChatDto {
	@IsNotEmpty()
	name: string;

	@IsOptional()
	visibility?: string;

	@IsOptional()
	password?: string;
}
