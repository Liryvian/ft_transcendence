import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class UpdateUserDto {
	// @ValidateIf((o) => {
	// 	return o.hasOwnProperty('name');
	// })
	// @IsNotEmpty()
	name?: string;

	// @ValidateIf((o) => {
	// 	return o.hasOwnProperty('password');
	// })
	// @IsNotEmpty()
	// @Optional()
	// @IsOptional()
	password?: string;
}
