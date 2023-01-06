import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';

@Controller('chatrooms')
export class ChatroomController {
	constructor(private readonly chatroomService: ChatroomService) {}

	@Post()
	create(@Body() createChatroomDto: CreateChatroomDto) {
		return this.chatroomService.create(createChatroomDto);
	}

	@Get()
	findAll() {
		return this.chatroomService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.chatroomService.findOne({ where: { id } });
	}

	@Patch(':id')
	update(
		@Param('id') id: number,
		@Body() updateChatroomDto: UpdateChatroomDto,
	) {
		return this.chatroomService.update(+id, updateChatroomDto);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.chatroomService.remove(+id);
	}
}
