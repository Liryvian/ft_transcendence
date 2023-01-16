import {
	Entity,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	PrimaryColumn,
} from 'typeorm';
import { User } from '../../../users/user/entities/user.entity';
import { Chat } from '../../chat/entities/chat.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('user_chats')
// !! note: need to find a way around the typeOrm error that @Index() creates, does any of you have a suggestion?
// @Index(['user_id', 'chat_id'], { unique: true })
export class UserChat {
	@PrimaryColumn({ name: 'user_id' })
	user_id: number;

	@PrimaryColumn({ name: 'chat_id' })
	chat_id: number;

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

	@ManyToMany(() => Role)
	roles: Role[];
}
