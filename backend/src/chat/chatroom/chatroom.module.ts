import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Chatroom} from "./entities/chatroom.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Chatroom])],
  controllers: [ChatroomController],
  providers: [ChatroomService]
})
export class ChatroomModule {}
