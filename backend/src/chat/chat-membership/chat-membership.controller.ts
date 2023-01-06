import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { ChatMembershipService } from './chat-membership.service';
import { CreateChatMembershipDto } from './dto/create-chat-membership.dto';
import { UpdateChatMembershipDto } from './dto/update-chat-membership.dto';

@Controller('chat-memberships')
export class ChatMembershipController {
	constructor(private readonly chatMembershipService: ChatMembershipService) {}

	@Post()
	create(@Body() createChatMembershipDto: CreateChatMembershipDto) {
		return this.chatMembershipService.create(createChatMembershipDto);
	}

	@Get()
	findAll() {
		return this.chatMembershipService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.chatMembershipService.findOne({ where: { id } });
	}

	@Patch(':id')
	update(
		@Param('id') id: number,
		@Body() updateChatMembershipDto: UpdateChatMembershipDto,
	) {
		return this.chatMembershipService.update(+id, updateChatMembershipDto);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.chatMembershipService.remove(+id);
	}
}

