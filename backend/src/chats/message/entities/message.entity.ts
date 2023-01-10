import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn, ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Chat } from '../../chat/entities/chat.entity';

@Entity('messages')
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	// @OneToOne(type => User, user => user.id) // can be added when user exists
	// @JoinColumn({name: 'sender_id'})
	// sender_id: User;

	@ManyToOne((type) => Chat, (chat) => chat.id)
	@JoinColumn({ name: 'chat_id' })
	chat_id: Chat;

	@Column()
	content: string;
}
