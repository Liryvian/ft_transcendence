import {
	Controller
} from '@nestjs/common';
import { ChatUserPermissionsService } from './chat_user_permissions.service';
import { CreateChatUserPermissionsDto } from './dto/create-cup.dto';

// @Controller('user-chat-permisisons')
export class UserChatPermissionsController {
	constructor(private service: ChatUserPermissionsService) {}

	async save() {
		return ;
	}

}