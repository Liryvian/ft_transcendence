import { PartialType } from '@nestjs/mapped-types';
import {CreateChatUserDto} from "./create-chat-user.dto";



export class UpdateChatUserDto extends PartialType(CreateChatUserDto) {
    //temporary should add decorators
    user_id?: number;

    chatroom_id?: number;
}
