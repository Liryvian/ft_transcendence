import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
	@IsNotEmpty()
	sender_id: number;

	@IsNotEmpty()
	chat: number;

	@IsNotEmpty()
	content: string;
}
