import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users/user/entities/user.entity';
import { Chat } from '../../chat/entities/chat.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity()
@Index(['chat_id', 'user_id', 'permission_id'], { unique: true })
export class ChatUserPermission {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	chat_id: number;

	@ManyToOne(() => Chat, (chat) => chat.id)
	@JoinColumn({ name: 'chat_id', referencedColumnName: 'id' })
	chats: Chat[];

	@Column()
	user_id: number;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
	users: User[];

	@Column()
	permission_id: number;

	@ManyToOne(() => Permission, (permission) => permission.id, { eager: true })
	@JoinColumn({ name: 'permission_id' })
	permissions: Permission[];
}
