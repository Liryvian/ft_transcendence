import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { UserChatService } from './user-chat.service';
import { CreateUserChatDto } from './dto/create-user-chat.dto';
import { UpdateUserChatDto } from './dto/update-user-chat.dto';

@Controller('user_chats')
export class UserChatController {
	constructor(private readonly userChatService: UserChatService) {}

	@Post()
	create(@Body() createUserChatDto: CreateUserChatDto) {
		return this.userChatService.create(createUserChatDto);
	}

	@Get()
	findAll() {
		return this.userChatService.findAll({
			relations: { chats: true, users: true },
		});
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.userChatService.findOne({
			where: { id },
		});
	}

	@Patch(':id')
	update(
		@Param('id') id: number,
		@Body() updateUserChatDto: UpdateUserChatDto,
	) {
		return this.userChatService.update(id, updateUserChatDto);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.userChatService.remove(id);
	}
}
