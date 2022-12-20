import {Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn} from 'typeorm';
import { MembershipState } from '../../membership-state/entities/membership-state.entity';
import { Chatroom } from '../../chatroom/entities/chatroom.entity';

@Entity('chatMemberships')
export class ChatMembership {
  @PrimaryGeneratedColumn() // we didn't designed this but my programme said: Primary column is required to have in all your entities. Use @PrimaryColumn decorator to add a primary column to your entity.
  id: number;

  // @ManyToOne(type => User, user => user.id) // connected to USER -> ID
  // user_id: User;

  @OneToOne((type) => Chatroom, (chatroom) => chatroom.id)
  chat_id: Chatroom;

  @OneToOne((type) => MembershipState, (membershipState) => membershipState.id)
  membership_id: MembershipState;
}
