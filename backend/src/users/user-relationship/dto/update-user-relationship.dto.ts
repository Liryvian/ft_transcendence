import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRelationshipDto } from './create-user-relationship.dto';

export class UpdateUserRelationshipDto extends PartialType(CreateUserRelationshipDto) {}
