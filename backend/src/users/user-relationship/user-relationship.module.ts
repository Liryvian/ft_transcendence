import { Module } from '@nestjs/common';
import { UserRelationshipService } from './user-relationship.service';
import { UserRelationshipController } from './user-relationship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRelationship } from './entities/user-relationship.entity';
import { UserRelationshipGateway } from './user-relationship.gateway';

@Module({
	imports: [TypeOrmModule.forFeature([UserRelationship])],
	controllers: [UserRelationshipController],
	providers: [UserRelationshipService, UserRelationshipGateway],
	exports: [UserRelationshipService, UserRelationshipGateway],
})
export class UserRelationshipModule {}
