import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class UserRelationsQueryDto {
	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	matchmaking_request?: boolean;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	invite?: boolean;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	games_as_player_one?: boolean;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	games_as_player_two?: boolean;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	relationshipTarget?: boolean;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	relationshipSource?: boolean;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	achievements?: boolean;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	in_chats?: boolean;
}
