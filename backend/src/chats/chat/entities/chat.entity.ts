import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../users/user/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity('chats')
export class Chat {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true, nullable: false })
	name: string;

	@ManyToMany(() => User, (user) => user.chats, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	users: User[];

	@Column({ default: 'public' })
	visibility: string;

	@Column({ nullable: false })
	@Exclude()
	password: string;

	@Column({ nullable: false })
	old_password: string;
}
