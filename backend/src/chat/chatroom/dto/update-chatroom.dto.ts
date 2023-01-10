import { PartialType } from '@nestjs/mapped-types';
import { CreateChatroomDto } from './create-chatroom.dto';
import {IsOptional} from "class-validator";

export class UpdateChatroomDto extends PartialType(CreateChatroomDto) {
	@IsOptional()
	name?: string;

	@IsOptional()
	visibility?: string;

	@IsOptional()
	password?: string;
}
