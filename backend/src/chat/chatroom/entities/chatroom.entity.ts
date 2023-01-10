import {
	Column,
	Entity,
	ManyToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users/user/entities/user.entity';

@Entity('chatrooms')
export class Chatroom {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany(() => User, (user) => user.id, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	user: User[];

	@Column()
	visibility: string;

	@Column()
	password: string;
}