import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { ChatUserPermissionModule } from '../chats/chat-user-permissions/chat-user-permission.module';
import { ChatModule } from '../chats/chat/chat.module';
import { MessageModule } from '../chats/message/message.module';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../users/user/user.module';
import { MeController } from './me.controller';

@Module({
	imports: [
		SharedModule,
		AuthModule,
		UserModule,
		ChatModule,
		MessageModule,
		ChatUserPermissionModule,
	],
	controllers: [MeController],
	providers: [AuthService],
})
export class MeModule {}
