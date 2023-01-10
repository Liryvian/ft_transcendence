import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatUser } from './entities/chat-user.entity';
import { ChatUserController } from './chat-user.controller';
import { ChatUserService } from './chat-user.service';

@Module({
	imports: [TypeOrmModule.forFeature([ChatUser])],
	controllers: [ChatUserController],
	providers: [ChatUserService],
})
export class ChatUserModule {}
