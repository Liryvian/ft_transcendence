import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class ChatRelationsQueryDto {
	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	has_users?: boolean;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	messages?: boolean;
}
