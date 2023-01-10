import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty() //ofcourse this is different in the real pong world
	name?: string;
}
