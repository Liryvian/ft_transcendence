import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
	@IsNotEmpty()
	sender_id: string;

	@IsNotEmpty()
	chat_id: number;

	@IsNotEmpty() // or do we want to be able to send empty messages? In London people used to send each other empty messages to let each other know they were thinking of one another <3, but whilst playing a game this seems overrated right? haha
	content: string;
}
