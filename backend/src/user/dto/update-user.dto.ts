import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsOptional, MinLength, ValidateIf } from 'class-validator';

export class UpdateUserDto {
	// @ValidateIf((o) => {
	// 	return o.hasOwnProperty('name');
	// })
	// @IsOptional()
	@Optional()
	@IsNotEmpty()
	@MinLength(1)
	name?: string;

	// @ValidateIf((o) => {
	// 	return o.hasOwnProperty('password');
	// })
	// @Optional()
	// @IsOptional()
	// @IsNotEmpty()
	password?: string;
}
