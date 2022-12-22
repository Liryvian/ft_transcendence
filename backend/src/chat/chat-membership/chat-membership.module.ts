import { Module } from '@nestjs/common';
import { ChatMembershipService } from './chat-membership.service';
import { ChatMembershipController } from './chat-membership.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMembership } from './entities/chat-membership.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMembership]), AuthModule],
  controllers: [ChatMembershipController],
  providers: [ChatMembershipService],
})
export class ChatMembershipModule {}
