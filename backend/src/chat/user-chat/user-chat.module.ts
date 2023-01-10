import { Module } from '@nestjs/common';
import { UserChatService } from './user-chat.service';
import { UserChatController } from './user-chat.controller';

@Module({
  controllers: [UserChatController],
  providers: [UserChatService]
})
export class UserChatModule {}
