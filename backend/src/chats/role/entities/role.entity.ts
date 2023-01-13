import {
	Column,
	Entity, JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { UserChat } from '../../user-chat/entities/user-chat.entity';

@Entity('roles')
export class Role {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	name: string;




	// @ManyToMany(() => UserChat)
	// @JoinTable()
	// public userchats: UserChat[];

	// @ManyToMany(() => UserChat, (userchat) => userchat.roles, {
	// 	onDelete: 'NO ACTION',
	// 	onUpdate: 'NO ACTION',
	// })
	// public userchats: UserChat[];
}
