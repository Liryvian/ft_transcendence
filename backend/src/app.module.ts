import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatMembershipModule } from './chat/chat-membership/chat-membership.module';
import { MembershipStateModule } from './chat/membership-state/membership-state.module';
import { ChatroomModule } from './chat/chatroom/chatroom.module';
import { MessageModule } from './chat/message/message.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [ChatMembershipModule, MembershipStateModule, ChatroomModule, MessageModule],
})
export class AppModule {}
