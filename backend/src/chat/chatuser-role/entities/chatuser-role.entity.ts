import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../../user/entities/user.entity';
import { Chatroom } from '../../chatroom/entities/chatroom.entity';
import { UserChat } from '../../user-chat/entities/user-chat.entity';
import { Role } from '../../role/entities/role.entity';

@Entity()
export class ChatuserRole {
	@PrimaryColumn({ name: 'chatuser_id' })
	user_id: number;

	@PrimaryColumn({ name: 'role_id' })
	chatroom_id: number;

	@ManyToOne(() => UserChat, (userchat) => userchat.id, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'chatuser_id', referencedColumnName: 'id' }])
	users: UserChat[];

	@ManyToOne(() => Role, (role) => role.id, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
	courses: Role[];
}
