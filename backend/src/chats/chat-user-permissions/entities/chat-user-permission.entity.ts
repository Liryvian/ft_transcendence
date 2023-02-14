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
	BLOCKED = 'blocked',
	EDIT_SETTINGS = 'edit_settings',
	LEFT = 'left',
	MANAGE_USERS = 'manage_users',
	POST = 'post',
	READ = 'read',
}

export const permissionsArray = [
	'blocked',
	'edit_settings',
	'left',
	'manage_users',
	'post',
	'read',
];

@Entity()
@Index(['chat_id', 'user_id', 'permission_id'], { unique: true })
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

	@Column()
	permission_id: number;

	// @ManyToOne(() => Permission, (permission) => permission.id, {
	// 	eager: true,
	// 	onDelete: 'CASCADE',
	// })
	// @JoinColumn({ name: 'permission_id' })
	// permissions: Permission[];
	@IsIn(permissionsArray)
	@Column()
	permissions: String;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
