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

		const socketMessage: UpdateMessage<Message> = {
			action: 'new',
			data: newMessage,
		};
		console.log('trying to emit socket message');
		// socket service should have a method that looks in it's own map
		// and send message to those users..
		const ret = this.socketService.chatServer.emit('newMessage', socketMessage);
		console.log('return value of socket emit: ', ret);
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
	remove(@Param('id') id: number) {
		return this.messageService.remove(id);
	}
}
