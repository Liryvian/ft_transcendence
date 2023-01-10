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
	// user: User[];

	@ManyToMany(() => User, (user) => user.chats, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	users?: User[];

	@Column()
	visibility: string;

	@Column()
	password: string;
}
