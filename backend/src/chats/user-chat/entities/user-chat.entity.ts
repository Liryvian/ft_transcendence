import {
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users/user/entities/user.entity';
import { Chat } from '../../chat/entities/chat.entity';

@Entity('user_chat')
export class UserChat {
	// @PrimaryGeneratedColumn()
	// id: number;

	@PrimaryColumn({ name: 'user_id' })
	userId: number;

	@PrimaryColumn({ name: 'chat_id' })
	chatId: number;

	@ManyToOne(() => User, (user) => user.chats, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
	users: User[];

	@ManyToOne(() => Chat, (chat) => chat.users, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'chat_id', referencedColumnName: 'id' }])
	chats: Chat[];
}
