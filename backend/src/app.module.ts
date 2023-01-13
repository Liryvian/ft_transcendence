import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimalModule } from './test_example/animal.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm/typeorm.service';
import { ChatModule } from './chats/chat/chat.module';
import { MessageModule } from './chats/message/message.module';
import { UserModule } from './users/user/user.module';
import { RoleModule } from './chats/role/role.module';
import { GameModule } from './pong/game/game.module';
import { UserChatModule } from './chats/user-chat/user-chat.module';
import { UserchatRoleModule } from './chats/userchat-role/userchat-role.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
		AnimalModule,
		ChatModule,
		MessageModule,
		UserModule,
		RoleModule,
		GameModule,
		UserChatModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
