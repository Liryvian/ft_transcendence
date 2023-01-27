import { Module } from '@nestjs/common';
import { UserRelationshipService } from './user-relationship.service';
import { UserRelationshipController } from './user-relationship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRelationship } from './entities/user-relationship.entity';
import { SharedModule } from '../../shared/shared.module';
import { UserModule } from '../user/user.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserRelationship]),
		SharedModule,
		UserModule,
	],
	controllers: [UserRelationshipController],
	providers: [UserRelationshipService],
	exports: [UserRelationshipService],
})
export class UserRelationshipModule {}
