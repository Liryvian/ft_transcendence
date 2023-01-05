import { PartialType } from '@nestjs/mapped-types';
import { CreateMembershipStateDto } from './create-membership-state.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateMembershipStateDto extends PartialType(
	CreateMembershipStateDto,
) {
	name?: string;
}
