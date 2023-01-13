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

@Entity('users_chats')
export class UserChat {
	@PrimaryGeneratedColumn()
	public id: number;

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

	// @ManyToMany(() => Role, (role: Role) => role.userchats)
	// @JoinTable()
	// public roles: Role[];

	// @ManyToMany(
	// 	() => Role,
	// 	(role) => role.userchats, //optional
	// 	{ onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
	// )
	// @JoinTable({
	// 	name: 'userchat_roles',
	// 	joinColumn: {
	// 		name: 'userchat_id',
	// 		// referencedColumnName: 'id',
	// 	},
	// 	inverseJoinColumn: {
	// 		name: 'role_id',
	// 		// referencedColumnName: 'id',
	// 	},
	// })
	// public roles: Role[];
}
