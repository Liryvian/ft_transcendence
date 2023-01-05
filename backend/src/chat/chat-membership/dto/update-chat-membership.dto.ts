import { PartialType } from '@nestjs/mapped-types';
import { CreateChatMembershipDto } from './create-chat-membership.dto';
import {IsNotEmpty} from "class-validator";

export class UpdateChatMembershipDto extends PartialType(
	CreateChatMembershipDto,
) {
    // @IsNotEmpty()
    // user_id: number; not sure, I think a membership can't exist without a user_id?

    chat_id?: number;

    @IsNotEmpty()
    membership_id?: number;
}
