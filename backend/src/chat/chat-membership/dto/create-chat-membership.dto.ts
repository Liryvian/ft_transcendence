import { IsNotEmpty } from 'class-validator';

export class CreateChatMembershipDto {
    @IsNotEmpty() // not sure
    id: number;

    // @IsNotEmpty()
    // user_id: number;

    @IsNotEmpty() // not sure
    chat_id: number;

    @IsNotEmpty() // not sure
    membership_id:number;
}