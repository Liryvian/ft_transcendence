import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Permission])],
	providers: [PermissionService],
	exports: [PermissionService],
})
export class PermissionsModule {}
