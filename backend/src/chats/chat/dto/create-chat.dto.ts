import { IsNotEmpty, IsOptional } from 'class-validator';
import { UserInChat } from '../../../users/user/entities/user.entity';
import { ChatType, ChatVisibility } from '../entities/chat.entity';

export class CreateChatDto {
	@IsNotEmpty()
	name: string;

	@IsOptional()
	visibility?: ChatVisibility;

	@IsOptional()
	password?: string;

	@IsOptional()
	type?: ChatType;

	@IsOptional()
	users?: UserInChat[];
}
