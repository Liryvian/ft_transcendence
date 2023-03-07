import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	RelationId,
	UpdateDateColumn,
} from 'typeorm';
import { Chat } from '../../chat/entities/chat.entity';
import { User } from '../../../users/user/entities/user.entity';

@Entity('messages', {
	orderBy: {
		created_at: 'ASC',
	},
})
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@ManyToOne(() => User, (user) => user.id, {
		nullable: false,
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'sender_id' })
	sender_id: User;

	@RelationId((message: Message) => message.sender_id)
	user_id: number;

	@ManyToOne(() => Chat, (chat) => chat.id, {
		nullable: false,
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'chat' })
	chat: Chat;

	@RelationId((message: Message) => message.chat)
	chat_id: number;

	@Column({ nullable: false })
	content: string;
}
