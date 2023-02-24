import { Module } from '@nestjs/common';
import { SocketModule } from '../socket/socket.module';
import { ChatsGateway } from './chats.gateway';

@Module({
	imports: [SocketModule],
	providers: [ChatsGateway],
	exports: [ChatsGateway],
})
export class ChatsModule {}
