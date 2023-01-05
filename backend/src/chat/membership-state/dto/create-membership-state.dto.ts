import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

export class CreateMembershipStateDto {
	@IsNotEmpty()
	name: string;
}
