import { Column, Entity, OneToOne } from 'typeorm';
import { Chatroom } from '../../chatroom/entities/chatroom.entity';

@Entity('messages')
export class Message {
  @Column() // should this be a primary key?
  id: string;

  @Column()
  timestamp: number;

  // @OneToOne(type => User, user => user.id) // can be added when user exists
  // sender_id: User;

  @OneToOne((type) => Chatroom, (chatRoom) => chatRoom.id)
  chat_id: Chatroom;

  @Column()
  content: string;
}
