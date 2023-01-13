import {
	Column,
	Entity,
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

	// @ManyToMany((type) => Chat, {
	// 	onDelete: 'CASCADE',
	// 	onUpdate: 'CASCADE',
	// })
	@ManyToMany(
		() => Chat,
		(chat) => chat.users, //optional
		{ onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
	)
	@JoinTable({
		name: 'user_chat',
		joinColumn: {
			name: 'user_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'chat_id',
			referencedColumnName: 'id',
		},
	})
	chats: Chat[];
}
