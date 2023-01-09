import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimalModule } from './test_example/animal.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm/typeorm.service';
import { ChatMembershipModule } from './chat/chat-membership/chat-membership.module';
import { MembershipStateModule } from './chat/membership-state/membership-state.module';
import { ChatroomModule } from './chat/chatroom/chatroom.module';
import { MessageModule } from './chat/message/message.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './chat/role/role.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
		AnimalModule,
		ChatMembershipModule,
		MembershipStateModule,
		ChatroomModule,
		MessageModule,
		UserModule,
		RoleModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
