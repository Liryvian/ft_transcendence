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
import { ChatuserRoleModule } from './chats/chatuser-role/chatuser-role.module';
import { GameModule } from './pong/game/game.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
		AnimalModule,
		ChatModule,
		MessageModule,
		UserModule,
		RoleModule,
		ChatuserRoleModule,
		GameModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
