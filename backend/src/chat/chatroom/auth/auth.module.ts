import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import {ChatroomModule} from "../chatroom.module";

@Module({
  imports: [
    ChatroomModule
  ],
  controllers: [AuthController]
})
export class AuthModule {}
