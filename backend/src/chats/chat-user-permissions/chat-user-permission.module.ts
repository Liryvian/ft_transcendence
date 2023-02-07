import { Module } from '@nestjs/common';
import { ChatUserPermissionService } from './chat-user-permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatUserPermission } from './entities/chat-user-permission.entity';

@Module({
	imports: [TypeOrmModule.forFeature([ChatUserPermission])],
	providers: [ChatUserPermissionService],
	exports: [ChatUserPermissionService],
})
export class ChatUserPermissionModule {}
