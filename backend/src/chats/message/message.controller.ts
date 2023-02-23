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
import { Message } from './entities/message.entity';
import { SocketService } from '../../socket/socket.service';
import { SingleMessage } from '../../socket/socket.types';
import { DeleteResult } from 'typeorm';

// should be imported!
type UpdateType = 'new' | 'update' | 'delete';

interface UpdateMessage<T> {
	action: UpdateType;
	data: T | any;
}

@Controller('messages')
export class MessageController {
	constructor(
		private readonly messageService: MessageService,
		private socketService: SocketService,
	) {}

	@Post()
	async create(@Body() createMessageDto: CreateMessageDto) {
		const newMessage: Message = await this.messageService.save(
			createMessageDto,
		);

		const socketMessage: UpdateMessage<SingleMessage> = {
			action: 'new',
			data: {
				id: newMessage.id,
				user_id: createMessageDto.sender_id,
				chat_id: createMessageDto.chat,
				content: newMessage.content,
				created_at: newMessage.created_at,
			},
		};
		this.socketService.chatServer.emit('messageListUpdate', socketMessage);
		return newMessage;
	}

	@Get()
	findAll() {
		return this.messageService.findAll({
			relations: { chat: true, sender_id: true },
		});
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.messageService.findOne({
			where: { id },
			relations: { chat: true, sender_id: true },
		});
	}

	@Delete(':id')
	async remove(@Param('id') id: number) {
		const found: Message = await this.messageService.findOne({
			where: { id: id },
			relations: { chat: true },
		});
		const deleteResult: DeleteResult = await this.messageService.remove(
			found.id,
		);

		const socketMessage: UpdateMessage<SingleMessage> = {
			action: 'delete',
			data: {
				id: found.id,
				chat_id: found.chat_id,
			},
		};
		this.socketService.chatServer.emit('messageListUpdate', socketMessage);
		return deleteResult;
	}
}
