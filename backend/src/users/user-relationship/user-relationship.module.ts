import { forwardRef, Module } from '@nestjs/common';
import { UserRelationshipService } from './user-relationship.service';
import { UserRelationshipController } from './user-relationship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRelationship } from './entities/user-relationship.entity';
import { SharedModule } from '../../shared/shared.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserRelationship]),
		forwardRef(() => AuthModule),
		SharedModule,
		UserModule,
	],
	controllers: [UserRelationshipController],
	providers: [UserRelationshipService],
	exports: [UserRelationshipService],
})
export class UserRelationshipModule {}
