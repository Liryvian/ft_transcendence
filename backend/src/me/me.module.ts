import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ChatUserPermissionModule } from '../chats/chat-user-permissions/chat-user-permission.module';
import { ChatModule } from '../chats/chat/chat.module';
import { MessageModule } from '../chats/message/message.module';
import { UserRelationshipModule } from '../users/user-relationship/user-relationship.module';
import { UserModule } from '../users/user/user.module';
import { MeController } from './me.controller';

@Module({
	imports: [
		UserModule,
		ChatModule,
		MessageModule,
		ChatUserPermissionModule,
		UserRelationshipModule,
	],
	controllers: [MeController],
	providers: [AuthService],
})
export class MeModule {}
