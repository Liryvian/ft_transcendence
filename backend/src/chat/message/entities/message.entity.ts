import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Chatroom } from '../../chatroom/entities/chatroom.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn() // we didn't designed this but my programme said: Primary column is required to have in all your entities. Use @PrimaryColumn decorator to add a primary column to your entity.
  id: number;

  // @Column() // should this be a primary key?
  // id: string;

  @Column()
  timestamp: number;

  // @OneToOne(type => User, user => user.id) // can be added when user exists
  // @JoinColumn({name: 'sender_id'})
  // sender_id: User;

  @OneToOne((type) => Chatroom, (chatRoom) => chatRoom.id)
  @JoinColumn({name: 'chat_id'})
  chat_id: Chatroom;

  @Column()
  content: string;
}
