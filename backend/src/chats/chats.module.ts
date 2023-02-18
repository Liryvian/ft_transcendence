import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';

@Module({
	providers: [ChatsGateway],
	exports: [ChatsGateway],
})
export class ChatsModule {}
