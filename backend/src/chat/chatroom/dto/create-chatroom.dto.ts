import { IsNotEmpty } from 'class-validator';
export class CreateChatroomDto {
    @IsNotEmpty() // not sure
    id: number;

    @IsNotEmpty() // not sure
    name: string;

    @IsNotEmpty() // not sure
    visibility: string;

    @IsNotEmpty() // not sure
    password: string;
}

