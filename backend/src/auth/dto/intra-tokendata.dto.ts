import { Equals, IsNotEmpty, IsNumber } from 'class-validator';

export class IntraTokendata {
	@IsNotEmpty()
	@Equals('bearer')
	token_type: string;

	@IsNotEmpty()
	access_token: string;

	@IsNotEmpty()
	refresh_token: string;

	@IsNotEmpty()
	scope: string;

	@IsNotEmpty()
	@IsNumber()
	expires_in: number;

	@IsNotEmpty()
	@IsNumber()
	created_at: number;
}
