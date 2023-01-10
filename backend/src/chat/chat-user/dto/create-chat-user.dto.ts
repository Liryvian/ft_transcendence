import { PrimaryColumn } from 'typeorm';
import { IsNotEmpty, isNotEmpty } from 'class-validator';

export class CreateChatUserDto {
	@IsNotEmpty()
	@PrimaryColumn({ name: 'user_id' })
	user_id: number;

	@IsNotEmpty()
	@PrimaryColumn({ name: 'chatroom_id' })
	chatroom_id: number;
}
