import { Module } from '@nestjs/common';
import { ChatuserRoleService } from './chatuser-role.service';
import { ChatuserRoleController } from './chatuser-role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatuserRole } from './entities/chatuser-role.entity';

@Module({
	imports: [TypeOrmModule.forFeature([ChatuserRole])],
	controllers: [ChatuserRoleController],
	providers: [ChatuserRoleService],
})
export class ChatuserRoleModule {}
