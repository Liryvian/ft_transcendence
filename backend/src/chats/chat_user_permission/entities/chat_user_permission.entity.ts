import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users/user/entities/user.entity';
import { ChatPermission } from '../../permissions/entities/chatpermissions.entity';
import { Chat } from '../../../chats/chat/entities/chat.entity';

@Entity()
export class Chat_User_Permissions {
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

	@ManyToOne(() => ChatPermission, (chatpermission) => chatpermission.id)
	@JoinColumn({ name: 'permission_id' })
	permissions: ChatPermission[];
}
