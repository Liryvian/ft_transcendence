import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users/user/entities/user.entity';
import { Exclude } from 'class-transformer';
import { Message } from '../../message/entities/message.entity';
import { IsIn } from 'class-validator';
import { Chat_User_Permissions } from '../../chat_user_permission/entities/chat_user_permission.entity';

const validVisibility = ['public', 'private'];

@Entity('chats')
export class Chat {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true, nullable: false })
	name: string;

	// @ManyToMany(() => User, (user) => user.chats, {
	// 	onDelete: 'CASCADE',
	// 	onUpdate: 'CASCADE',
	// })
	// @JoinTable({
	// 	name: 'user_chats',
	// 	joinColumn: {
	// 		name: 'chat_id',
	// 		referencedColumnName: 'id',
	// 	},
	// 	inverseJoinColumn: {
	// 		name: 'user_id',
	// 		referencedColumnName: 'id',
	// 	},
	// })
	// users: User[];

	@OneToMany(() => Chat_User_Permissions, (cup) => cup.users)
	userchat: Chat_User_Permissions[];

	@IsIn(validVisibility)
	@Column({ default: 'public' })
	visibility: string;

	@Column({ nullable: true })
	@Exclude()
	password: string;

	@OneToMany(() => Message, (message) => message.chat_id)
	messages: Message[];
}
