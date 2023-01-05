import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chatrooms')
export class Chatroom {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	visibility: string;

	@Column()
	password: string;
}
