import { IsIn } from 'class-validator';
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../users/user/entities/user.entity';
import { Chat } from '../../chat/entities/chat.entity';

export enum permissionsEnum {
	READ = 'read',
	POST = 'post',
	LEFT = 'left',
	BLOCKED = 'blocked',
	MANAGE_USERS = 'manage_users',
	EDIT_SETTINGS = 'edit_settings',
}

export const permissionsArray = [
	'read',
	'post',
	'left',
	'blocked',
	'manage_users',
	'edit_settings',
];

@Entity()
@Index(['chat_id', 'user_id', 'permission'], { unique: true })
export class ChatUserPermission {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	chat_id: number;

	@ManyToOne(() => Chat, (chat) => chat.id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'chat_id', referencedColumnName: 'id' })
	chats: Chat[];

	@Column()
	user_id: number;

	@ManyToOne(() => User, (user) => user.id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
	users: User[];

	@IsIn(permissionsArray)
	@Column()
	permission: String;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
