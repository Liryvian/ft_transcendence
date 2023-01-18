import { Module } from '@nestjs/common';
import { UserChatService } from './user-chat.service';
import { UserChatController } from './user-chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChat } from './entities/user-chat.entity';

@Module({
	imports: [TypeOrmModule.forFeature([UserChat])],
	controllers: [UserChatController],
	providers: [UserChatService],
})
export class UserChatModule {}
