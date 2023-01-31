import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users/user/entities/user.entity';
import { Chat } from '../../chat/entities/chat.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity()
export class ChatUserPermission {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	user_id: number;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'user_id' })
	users: User[];

	@Column()
	chat_id: number;

	@ManyToOne(() => Chat, (chat) => chat.id)
	@JoinColumn({ name: 'chat_id' })
	chats: Chat[];

	@Column()
	permission_id: number;

	@ManyToOne(() => Permission, (permission) => permission.id)
	@JoinColumn({ name: 'permission_id' })
	permissions: Permission[];
}
