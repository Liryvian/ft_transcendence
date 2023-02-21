import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { AuthModule } from '../../auth/auth.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Chat]),
		forwardRef(() => AuthModule),
		SharedModule,
	],
	controllers: [ChatController],
	providers: [ChatService],
	exports: [ChatService],
})
export class ChatModule {}
