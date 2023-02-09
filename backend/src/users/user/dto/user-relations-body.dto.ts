import { IsBoolean, IsOptional } from 'class-validator';

export class UserRelationsBodyDto {
	@IsOptional()
	@IsBoolean()
	matchmaking_request?: boolean;

	@IsOptional()
	@IsBoolean()
	invite?: boolean;

	@IsOptional()
	@IsBoolean()
	games_as_player_one?: boolean;

	@IsOptional()
	@IsBoolean()
	games_as_player_two?: boolean;

	@IsOptional()
	@IsBoolean()
	relationshipTarget?: boolean;

	@IsOptional()
	@IsBoolean()
	relationshipSource?: boolean;

	@IsOptional()
	@IsBoolean()
	achievements?: boolean;

	@IsOptional()
	@IsBoolean()
	in_chats?: boolean;
}
