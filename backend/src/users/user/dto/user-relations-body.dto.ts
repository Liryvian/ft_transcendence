import { IsBoolean, IsOptional } from 'class-validator';

export class UserRelationsBodyDto {
	@IsOptional()
	@IsBoolean()
	matchmaking_request?: boolean = false;

	@IsOptional()
	@IsBoolean()
	invite?: boolean = false;

	@IsOptional()
	@IsBoolean()
	games_as_player_one?: boolean = false;

	@IsOptional()
	@IsBoolean()
	games_as_player_two?: boolean = false;

	@IsOptional()
	@IsBoolean()
	relationshipTarget?: boolean = false;

	@IsOptional()
	@IsBoolean()
	relationshipSource?: boolean = false;

	@IsOptional()
	@IsBoolean()
	achievements?: boolean = false;

	@IsOptional()
	@IsBoolean()
	in_chats?: boolean = false;
}
