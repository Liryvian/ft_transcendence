import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
} from '@nestjs/common';
import { UserChatService } from './user-chat.service';
import { CreateUserChatDto } from './dto/create-user-chat.dto';

@Controller('user-chats')
export class UserChatController {
	constructor(private readonly userChatService: UserChatService) {}

	@Post()
	async create(@Body() createUserChatDto: CreateUserChatDto) {
		try {
			const x = await this.userChatService.save(createUserChatDto);
			console.log({ x });
			return x;
		} catch {
			throw new BadRequestException('user can only be in a chat once');
		}
	}

	@Get()
	findAll() {
		return this.userChatService.findAll({
			relations: { chats: true, users: true, roles: true },
		});
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.userChatService.findOne({
			/**
			 *
			 * THIS NEEDS TO CHANGE
			 *
			 */
			where: { user_id: id },
			/**
			 *
			 * THIS NEEDS TO CHANGE
			 *
			 */
		});
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.userChatService.remove(id);
	}
}
