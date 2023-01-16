import {
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users/user/entities/user.entity';
import { Chat } from '../../chat/entities/chat.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('user_chats')
export class UserChat {
	// @PrimaryGeneratedColumn()
	// id: number;

	@PrimaryColumn({ name: 'user_id' })
	userId: number;

	@PrimaryColumn({ name: 'chat_id' })
	chatId: number;

	@ManyToOne(() => User, (user) => user.chats, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
	users: User[];

	@ManyToOne(() => Chat, (chat) => chat.users, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'chat_id', referencedColumnName: 'id' }])
	chats: Chat[];
}
