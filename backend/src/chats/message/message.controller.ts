import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@Post()
	create(@Body() createMessageDto: CreateMessageDto) {
		return this.messageService.create(createMessageDto);
	}

	@Get()
	findAll() {
		return this.messageService.findAll({
			relations: { chat_id: true, sender_id: true },
		});
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.messageService.findOne({
			where: { id },
			relations: { chat_id: true, sender_id: true },
		});
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.messageService.remove(+id);
	}
}