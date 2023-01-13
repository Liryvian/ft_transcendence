import { PartialType } from '@nestjs/mapped-types';
import { CreateUserChatDto } from './create-user-chat.dto';
import { PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserChatDto extends PartialType(CreateUserChatDto) {
	//this needs to be protected for doubles
	@IsNotEmpty()
	userId: number;

	//updating chatId should not be possible do you agree?
	// @IsNotEmpty()
	// chatId: number;
}
