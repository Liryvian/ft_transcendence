import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from '../../../chats/chat/entities/chat.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany((type) => Chat, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinTable({
		name: 'user_chats',
		joinColumn: {
			name: 'user_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'chat_id',
			referencedColumnName: 'id',
		},
	})
	chatroom: Chat[];
}
