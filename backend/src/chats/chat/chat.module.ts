import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { AuthModule } from '../../auth/auth.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Chat]),
		AuthModule
	],
	controllers: [ChatController],
	providers: [ChatService],
	exports: [ChatService],
})
export class ChatModule {}
