import { Module } from '@nestjs/common';
import { UserRelationshipService } from './user-relationship.service';
import { UserRelationshipController } from './user-relationship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRelationship } from './entities/user-relationship.entity';

@Module({
	imports: [TypeOrmModule.forFeature([UserRelationship])],
	controllers: [UserRelationshipController],
	providers: [UserRelationshipService],
	exports: [UserRelationshipService],
})
export class UserRelationshipModule {}
