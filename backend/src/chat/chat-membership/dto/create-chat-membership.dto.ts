import { IsNotEmpty } from 'class-validator';

export class CreateChatMembershipDto {
	// @IsNotEmpty()
	// user_id: number;

	@IsNotEmpty()
	chat_id: number;

	@IsNotEmpty()
	membership_id: number;
}
