import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Chatroom } from '../../chatroom/entities/chatroom.entity';

@Entity('messages')
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	timestamp: number;

	// @OneToOne(type => User, user => user.id) // can be added when user exists
	// @JoinColumn({name: 'sender_id'})
	// sender_id: User;

	@OneToOne((type) => Chatroom, (chatRoom) => chatRoom.id)
	@JoinColumn({ name: 'chat_id' })
	chat_id: Chatroom;

	@Column()
	content: string;
}
