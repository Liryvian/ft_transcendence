import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from "../../../user/entities/user.entity";

@Entity('chatrooms')
export class Chatroom {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany((type) => User, (user) => user.id)
	@JoinColumn({ name: 'user_id' })
	user_id: string;

	@Column()
	visibility: string;

	@Column()
	password: string;
}
