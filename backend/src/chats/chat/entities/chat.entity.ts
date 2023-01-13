import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../users/user/entities/user.entity';

@Entity('chat')
export class Chat {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	// @ManyToMany(() => User, (user) => user.id, {
	// 	onDelete: 'CASCADE',
	// 	onUpdate: 'CASCADE',
	// })
	// user_id: User[];

	@ManyToMany(() => User, (user) => user.chats, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	users: User[];

	@Column()
	visibility: string;

	@Column()
	password: string;
}
