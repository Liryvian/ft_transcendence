import { Module } from '@nestjs/common';
import { ChatMembershipService } from './chat-membership.service';
import { ChatMembershipController } from './chat-membership.controller';

@Module({
  controllers: [ChatMembershipController],
  providers: [ChatMembershipService]
})
export class ChatMembershipModule {}
