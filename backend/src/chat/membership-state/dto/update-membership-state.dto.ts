import { PartialType } from '@nestjs/mapped-types';
import { CreateMembershipStateDto } from './create-membership-state.dto';

export class UpdateMembershipStateDto extends PartialType(CreateMembershipStateDto) {}
