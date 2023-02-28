import { Module } from '@nestjs/common';
import { UserRelationshipService } from './user-relationship.service';
import { UserRelationshipController } from './user-relationship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRelationship } from './entities/user-relationship.entity';
import { UserRelationshipGateway } from './user-relationship.gateway';
import { AuthModule } from '../../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserRelationship]),
		AuthModule,
		UserModule,
	],
	controllers: [UserRelationshipController],
	providers: [UserRelationshipService, UserRelationshipGateway],
	exports: [UserRelationshipService, UserRelationshipGateway],
})
export class UserRelationshipModule {}
