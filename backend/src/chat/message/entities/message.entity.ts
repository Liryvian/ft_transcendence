import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn, ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Chatroom } from '../../chatroom/entities/chatroom.entity';

@Entity('messages')
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	// @OneToOne(type => User, user => user.id) // can be added when user exists
	// @JoinColumn({name: 'sender_id'})
	// sender_id: User;

	@ManyToOne((type) => Chatroom, (chatRoom) => chatRoom.id)
	@JoinColumn({ name: 'chat_id' })
	chat_id: Chatroom;

	@Column()
	content: string;
}
