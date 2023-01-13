import { Module } from '@nestjs/common';
import { UserchatRoleService } from './userchat-role.service';
import { UserchatRoleController } from './userchat-role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserchatRole } from './entities/userchat-role.entity';

@Module({
	imports: [TypeOrmModule.forFeature([UserchatRole])],
	controllers: [UserchatRoleController],
	providers: [UserchatRoleService],
})
export class UserchatRoleModule {}
