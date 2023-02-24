import { IsNotEmpty, IsOptional } from 'class-validator';
import { UserInChat } from '../../../users/user/entities/user.entity';

export class CreateChatDto {
	@IsNotEmpty()
	name: string;

	@IsOptional()
	visibility?: string;

	@IsOptional()
	password?: string;

	@IsOptional()
	type?: string;

	@IsOptional()
	users?: UserInChat[];
}
