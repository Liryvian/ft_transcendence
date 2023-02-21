import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { SocketModule } from '../../socket/socket.module';

@Module({
	imports: [TypeOrmModule.forFeature([Message]), SocketModule],
	controllers: [MessageController],
	providers: [MessageService],
	exports: [MessageService],
})
export class MessageModule {}
