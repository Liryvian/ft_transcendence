import {INestApplication} from "@nestjs/common";
import {CreateChatroomDto} from "../src/chat/chatroom/dto/create-chatroom.dto";
import {ChatroomController} from "../src/chat/chatroom/chatroom.controller";


describe('chatroom e2e', () => {
   let app: INestApplication;
   let gameControllen: ChatroomController;

   // const mockChatroom: CreateChatroomDto = { };
}