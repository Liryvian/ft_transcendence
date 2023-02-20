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

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'sender_id' })
	sender_id: User;

	@RelationId((message: Message) => message.sender_id)
	user_id: number;

	@ManyToOne(() => Chat, (chat) => chat.id)
	@JoinColumn({ name: 'chat_id' })
	chat_id: Chat;

	@Column({ nullable: false })
	content: string;
}
