import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Chatroom } from '../../../chat/chatroom/entities/chatroom.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany((type) => Chatroom, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinTable({
		name: 'user_chatrooms',
		joinColumn: {
			name: 'user_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'chat_id',
			referencedColumnName: 'id',
		},
	})
	chatroom: Chatroom[];
}