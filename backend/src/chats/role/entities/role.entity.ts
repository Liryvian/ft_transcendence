import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { UserChat } from '../../user-chat/entities/user-chat.entity';

@Entity('roles')
export class Role {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false })
	name: string;

	@ManyToMany(() => UserChat)
	@JoinTable({
		name: 'userchat_roles',
	})
	userChats: UserChat[];
}
