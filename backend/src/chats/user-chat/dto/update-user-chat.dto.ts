import { PartialType } from '@nestjs/mapped-types';
import { CreateUserChatDto } from './create-user-chat.dto';
import { IsOptional} from 'class-validator';

export class UpdateUserChatDto extends PartialType(CreateUserChatDto) {
	//this needs to be protected for doubles
	//since it is only one variable, @IsNotEmpty() decorator? of not?
	@IsOptional()
	user_id?: number;
}
