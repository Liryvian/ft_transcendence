import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { IsNotEmpty } from 'class-validator';

//not sure if we want to be able to update our messages.. maybe I can also delete this entire file? or conflicts that with the CRUD methodology?

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
	@IsNotEmpty()
	sender_id: string;

	@IsNotEmpty()
	chat_id: number;

	@IsNotEmpty()
	content: string;
}
