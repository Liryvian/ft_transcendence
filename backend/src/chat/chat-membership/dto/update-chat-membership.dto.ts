import { PartialType } from '@nestjs/mapped-types';
import { CreateChatMembershipDto } from './create-chat-membership.dto';

export class UpdateChatMembershipDto extends PartialType(CreateChatMembershipDto) {}
