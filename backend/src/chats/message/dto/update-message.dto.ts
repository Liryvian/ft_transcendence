import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
	//!! not sure if we want to be able to update ou message content.. Personally I'd say delete this entire file?
	@IsOptional()
	content: string;
}
