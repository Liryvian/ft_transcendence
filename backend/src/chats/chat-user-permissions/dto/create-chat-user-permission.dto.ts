import { IsIn, IsNotEmpty } from 'class-validator';
import { permissionsArray } from '../entities/chat-user-permission.entity';

export class CreateChatUserPermissionDto {
	@IsNotEmpty()
	user_id: number;

	@IsNotEmpty()
	chat_id: number;

	@IsIn(permissionsArray)
	@IsNotEmpty()
	permission: String;
}
