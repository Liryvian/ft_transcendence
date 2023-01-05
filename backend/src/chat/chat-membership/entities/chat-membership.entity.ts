import {Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn} from 'typeorm';
import { MembershipState } from '../../membership-state/entities/membership-state.entity';
import { Chatroom } from '../../chatroom/entities/chatroom.entity';

@Entity('chat_memberships')
export class ChatMembership {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(type => User, user => user.id) // connected to USER -> ID
  // @JoinColumn({name: 'user_id'})
  // user_id: User;

  @OneToOne((type) => Chatroom, (chatroom) => chatroom.id)
  @JoinColumn({name: 'chat_id'})
  chat_id: Chatroom;

  @OneToOne((type) => MembershipState, (membershipState) => membershipState.id)
  @JoinColumn({name: 'membership_id'})
  membership_id: MembershipState;
}
