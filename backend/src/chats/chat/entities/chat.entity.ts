import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Message } from '../../message/entities/message.entity';
import { IsIn } from 'class-validator';
import { ChatUserPermission } from '../../chat-user-permissions/entities/chat-user-permission.entity';
import { IsArray, IsNumber } from 'class-validator';
import { Permission } from '../../permissions/entities/permission.entity';
var groupBy = require('lodash/groupBy');

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

	@OneToMany(() => ChatUserPermission, (cup) => cup.users, { eager: true })
	@Exclude()
	users_permissions: ChatUserPermission[];

	@Expose()
	get users() {
		return groupBy(
			this.users_permissions.filter((up) => up.chat_id == this.id),
			'user_id',
		);
		// return this.users_permissions.reduce((acc, curr) => {
		// 	const index = acc.findIndex((obj) => obj.user_id == curr.user_id);

		// 	// console.log({ acc, curr, index });
		// 	if (index === -1) {
		// 		acc.push({ user_id: curr.user_id, permissions: [curr.permissions] });
		// 		// console.log('added new object', JSON.stringify(acc, null, 2));
		// 	} else {
		// 		acc[index].permissions.push(curr.permissions);
		// 		// console.log('appened permissions', JSON.stringify(acc, null, 2));
		// 	}
		// 	return acc;
		// }, []);
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
