import { Equals, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class IntraTokendataDto {
	@IsNotEmpty()
	@Equals('bearer')
	token_type: string;

	@IsNotEmpty()
	access_token: string;

	@IsOptional()
	@IsNotEmpty()
	refresh_token?: string;

	@IsOptional()
	@IsNotEmpty()
	scope?: string;

	@IsNotEmpty()
	@IsNumber()
	expires_in: number;

	@IsNotEmpty()
	@IsNumber()
	created_at: number;
}
