import { Controller, Post, Body } from '@nestjs/common';
import {ChatroomService} from "../chatroom.service";

@Controller()
export class AuthController {

    constructor(private chatroomService: ChatroomService) {
    }
    @Post('register-chatroom')
    async register(@Body() body){
        return this.chatroomService.create(body);
    }
}