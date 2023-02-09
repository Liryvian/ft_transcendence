import { IsBoolean, IsOptional } from 'class-validator';

export class ChatRelationsBodyDto {
	@IsOptional()
	@IsBoolean()
	has_users?: boolean;

	@IsOptional()
	@IsBoolean()
	messages?: boolean;
}
