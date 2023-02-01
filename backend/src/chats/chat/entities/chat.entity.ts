import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Message } from '../../message/entities/message.entity';
import { IsIn } from 'class-validator';
import { ChatUserPermission } from '../../chat-user-permissions/entities/chat-user-permission.entity';
import { IsArray, IsNumber } from 'class-validator';
import { Permission } from '../../permissions/entities/permission.entity';

const validVisibility = ['public', 'private'];

export class UsersWithPermissions {
	@IsNumber()
	user_id: number;

	@IsArray()
	permissions: Permission[];
}

@Entity('chats')
export class Chat {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true, nullable: false })
	name: string;

	@OneToMany(() => ChatUserPermission, (cup) => cup.chats)
	@Exclude()
	has_users: ChatUserPermission[];

	@Expose()
	get users() {
		return this.has_users?.reduce((acc, curr) => {
			let index = acc.findIndex((obj) => obj.user_id == curr.user_id);

			if (index === -1) {
				index = acc.push({ user_id: curr.user_id, permissions: [] });
				index--;
			}
			acc[index].permissions.push(curr.permissions);
			return acc;
		}, []);
	}

	@IsIn(validVisibility)
	@Column({ default: 'public' })
	visibility: string;

	@Column({ nullable: true })
	@Exclude()
	password: string;

	@OneToMany(() => Message, (message) => message.chat_id)
	messages: Message[];
}
