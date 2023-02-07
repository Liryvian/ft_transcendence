import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class UserRelationsQueryDto {
	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	public matchmaking_request?: boolean;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	public invite?: boolean;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	public games_as_player_one?: boolean;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	public games_as_player_two?: boolean;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	public relationshipTarget?: boolean;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	public relationshipSource?: boolean;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	public achievements?: boolean;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	public in_chats?: boolean;
}
