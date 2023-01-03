import { Controller, Post, Body } from '@nestjs/common';
import {ChatMembershipService} from "../chat-membership.service";

@Controller()
export class AuthController {

    constructor(private chatMembershipService: ChatMembershipService) {
    }
    @Post('register-chat-membership')
    async register(@Body() body){
        return this.chatMembershipService.create(body);
    }
}
