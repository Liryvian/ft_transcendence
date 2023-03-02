import { IsNotEmpty, IsOptional } from 'class-validator';

export class TwoFaDto {
	@IsOptional()
	secret?: string;

	@IsNotEmpty()
	token: string;
}
