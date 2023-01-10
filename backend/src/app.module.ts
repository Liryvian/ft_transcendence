import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimalModule } from './test_example/animal.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm/typeorm.service';
import { ChatroomModule } from './chat/chatroom/chatroom.module';
import { MessageModule } from './chat/message/message.module';
import { UserModule } from './users/user/user.module';
import { RoleModule } from './chat/role/role.module';
import { ChatuserRoleModule } from './chat/chatuser-role/chatuser-role.module';
import { GameModule } from './pong/game/game.module';
import { ChatUserModule } from './chat/chat-user/chat-user.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
		AnimalModule,
		ChatroomModule,
		MessageModule,
		UserModule,
		RoleModule,
		ChatuserRoleModule,
		GameModule,
		ChatUserModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
