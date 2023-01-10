import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { ChatUser } from '../../chat-user/entities/chat-user.entity';

@Entity()
export class ChatuserRole {
	@PrimaryColumn({ name: 'chatuser_id' })
	user_id: number;

	@PrimaryColumn({ name: 'role_id' })
	chatroom_id: number;

	@ManyToOne(() => ChatUser, (chatUser) => chatUser.id, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'chatuser_id', referencedColumnName: 'id' }])
	users: ChatUser[];

	@ManyToOne(() => Role, (role) => role.id, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
	courses: Role[];
}
