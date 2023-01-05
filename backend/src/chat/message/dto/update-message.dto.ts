import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
	@IsNotEmpty()
	timestamp: number;

	// @IsNotEmpty()
	// sender_id: User;

	@IsNotEmpty()
	chat_id: number;

	@IsNotEmpty() // or do we want to be able to send empty messages? In London people used to send eachother empty messages to let each other know they were thinking of one another <3, but whilst playing a game this seems overrated right? haha
	content: string;
}
