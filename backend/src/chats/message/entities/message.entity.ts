import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Chat } from '../../chat/entities/chat.entity';
import { User } from '../../../users/user/entities/user.entity';

@Entity('messages')
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@OneToOne((type) => User, (user) => user.id)
	@JoinColumn({ name: 'sender_id' })
	sender_id: User;

	@ManyToOne((type) => Chat, (chat) => chat.id)
	@JoinColumn({ name: 'chat_id' })
	chat_id: Chat;

	// @ManyToOne(() => Chat, (chat) => chat.messages)
	// chat_id: Chat;

	@Column({ nullable: false })
	content: string;
}
