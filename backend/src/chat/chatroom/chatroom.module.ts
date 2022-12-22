import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatroom } from './entities/chatroom.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chatroom]), AuthModule],
  controllers: [ChatroomController],
  providers: [ChatroomService],
})
export class ChatroomModule {}
