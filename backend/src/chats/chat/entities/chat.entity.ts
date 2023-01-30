import {
	Column,
	Entity,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users/user/entities/user.entity';
import { Exclude } from 'class-transformer';
import { Message } from '../../message/entities/message.entity';
import { IsIn } from 'class-validator';

const validVisibility = ['public', 'private'];

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

	@IsIn(validVisibility)
	@Column({ default: 'public' })
	visibility: string;

	@Column({ nullable: true })
	@Exclude()
	password: string;

	@OneToMany(() => Message, (message) => message.chat_id)
	messages: Message[];
}
