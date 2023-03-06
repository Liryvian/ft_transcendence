import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { MessageModule } from '../message/message.module';
import { SocketModule } from '../../socket/socket.module';
import { ChatUserPermissionModule } from '../chat-user-permissions/chat-user-permission.module';
import { AuthModule } from '../../auth/auth.module';
import { UserRelationshipModule } from '../../users/user-relationship/user-relationship.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Chat]),
		AuthModule,
		ChatUserPermissionModule,
		MessageModule,
		UserRelationshipModule,
		SocketModule,
	],
	controllers: [ChatController],
	providers: [ChatService],
	exports: [ChatService],
})
export class ChatModule {}
